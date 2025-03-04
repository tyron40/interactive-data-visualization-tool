import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ChartConfig } from '../../types';

interface PieChartProps {
  data: any[];
  config: ChartConfig;
  width?: number;
  height?: number;
  className?: string;
}

const PieChart: React.FC<PieChartProps> = ({
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

    const margin = { top: 40, right: 30, bottom: 40, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const xField = config.dimensions?.x || '';
    const yField = config.dimensions?.y || '';

    // Create the chart group
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

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

    // Create color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d[xField]))
      .range(config.colors || d3.schemeCategory10);

    // Create pie generator
    const pie = d3
      .pie<any>()
      .value((d) => d[yField])
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<any>()
      .innerRadius(0)
      .outerRadius(radius);

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

    // Create pie slices
    const arcs = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colorScale(d.data[xField]))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .on('mouseover', (event, d) => {
        if (config.tooltip?.show) {
          const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(
              `<div>
                <strong>${d.data[xField]}</strong><br/>
                ${yField}: ${d.data[yField]}<br/>
                Percentage: ${percent.toFixed(1)}%
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

    // Add labels
    const outerArc = d3
      .arc<any>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    arcs
      .append('text')
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('text-anchor', (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .text((d) => {
        const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
        if (percent < 3) return '';
        return d.data[xField];
      })
      .style('font-size', '12px');

    // Add polylines between slices and labels
    arcs
      .append('polyline')
      .attr('points', (d) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        const percent = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
        if (percent < 3) return '';
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('fill', 'none')
      .style('stroke', '#999')
      .style('stroke-width', '1px');

    // Add legend if needed
    if (config.legend?.show) {
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

export default PieChart;