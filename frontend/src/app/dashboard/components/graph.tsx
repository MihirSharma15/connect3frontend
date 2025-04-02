"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


export default function Graph({ nodes, edges }) {
  const svgRef = useRef(null);

  useEffect(() => {
    // Select the SVG container
    const svg = d3.select(svgRef.current);

    // Set the SVG to fill the screen
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Clear previous content
    svg.selectAll("*").remove();

    // Add a group ("g") element for zoom and pan
    const g = svg.append("g");

    // Set up zoom behavior
    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform); // Apply transformations
    });

    // Attach zoom behavior to the SVG
    svg.call(zoom);

    // Set up force simulation for node positioning
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(edges)
          .id((d) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Add edges (lines)
    const link = g
      .append("g")
      .attr("class", "edges")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", "#666")
      .attr("stroke-width", 2);

    // Add nodes (circles)
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#0074D9");

    // Add labels to nodes
    const label = g
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .style("font-size", "10px")
      .style("fill", "#fff");

    // Update positions on every simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  }, [nodes, edges]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: "100vw",   // Full width
        height: "100vh",  // Full height
        border: "1px solid black"
      }}
    ></svg>
  );
}
