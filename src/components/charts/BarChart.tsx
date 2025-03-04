import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ChartConfig } from '../../types';

interface BarChartProps {
  data: any[];
  config: ChartConfig;
  width?: number;
  height?: number;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
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
    const colorField = config.dimensions?.color;

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d[xField]))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[yField]) || 0])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(colorField ? data.map((d) => d[colorField]) : ['default'])
      .range(config.colors || d3.schemeCategory10);

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
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

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

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d[xField]) || 0)
      .attr('y', (d) => yScale(d[yField]))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => innerHeight - yScale(d[yField]))
      .attr('fill', (d) => colorScale(colorField ? d[colorField] : 'default'))
      .on('mouseover', (event, d) => {
        if (config.tooltip?.show) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(
              `<div>
                <strong>${d[xField]}</strong><br/>
                ${yField}: ${d[yField]}
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
        .attr('transform', (d, i) => `translate(0,${i * 20})`);

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

export default BarChart;