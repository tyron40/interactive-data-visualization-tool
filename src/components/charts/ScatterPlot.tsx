import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ChartConfig } from '../../types';

interface ScatterPlotProps {
  data: any[];
  config: ChartConfig;
  width?: number;
  height?: number;
  className?: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  config,
  width = 600,
  height = 400,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xField = config.dimensions?.x || '';
    const yField = config.dimensions?.y || '';
    const sizeField = config.dimensions?.size;
    const colorField = config.dimensions?.color;

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d[xField]) || 0,
        d3.max(data, (d) => d[xField]) || 0,
      ])
      .nice()
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d[yField]) || 0,
        d3.max(data, (d) => d[yField]) || 0,
      ])
      .nice()
      .range([innerHeight, 0]);

    const sizeScale = sizeField
      ? d3
          .scaleLinear()
          .domain([
            d3.min(data, (d) => d[sizeField]) || 0,
            d3.max(data, (d) => d[sizeField]) || 0,
          ])
          .range([4, 20])
      : () => 6;

    const colorScale = colorField
      ? d3
          .scaleOrdinal()
          .domain(Array.from(new Set(data.map((d) => d[colorField]))))
          .range(config.colors || d3.schemeCategory10)
      : () => config.colors?.[0] || '#3b82f6';

    // Create the chart group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add title
    if (config.title) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(config.title);
    }

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Add x-axis label
    if (config.xAxis?.title) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .text(config.xAxis.title);
    }

    // Add y-axis
    g.append('g').call(d3.axisLeft(yScale));

    // Add y-axis label
    if (config.yAxis?.title) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left + 15)
        .attr('text-anchor', 'middle')
        .text(config.yAxis.title);
    }

    // Add grid lines
    if (config.yAxis?.gridLines) {
      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '3,3');
    }

    if (config.xAxis?.gridLines) {
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '3,3');
    }

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('transition', 'opacity 0.2s');

    // Add points
    g.selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d[xField]))
      .attr('cy', (d) => yScale(d[yField]))
      .attr('r', (d) => (sizeField ? sizeScale(d[sizeField]) : 6))
      .attr('fill', (d) => (colorField ? colorScale(d[colorField]) : colorScale(0)))
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        if (config.tooltip?.show) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(
              `<div>
                <strong>${xField}: ${d[xField]}</strong><br/>
                ${yField}: ${d[yField]}
                ${sizeField ? `<br/>${sizeField}: ${d[sizeField]}` : ''}
                ${colorField ? `<br/>${colorField}: ${d[colorField]}` : ''}
              </div>`
            )
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        }
      })
      .on('mouseout', () => {
        if (config.tooltip?.show) {
          tooltip.transition().duration(500).style('opacity', 0);
        }
      });

    // Add legend if needed
    if (config.legend?.show && colorField) {
      const legend = svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('g')
        .data(colorScale.domain())
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(0,${i * 20 + margin.top})`);

      legend
        .append('rect')
        .attr('x', width - margin.right - 19)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', colorScale);

      legend
        .append('text')
        .attr('x', width - margin.right - 24)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'end')
        .text((d) => d);
    }

    // Clean up tooltip on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data, config, width, height]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default ScatterPlot;