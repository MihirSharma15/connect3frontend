"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Graph({ nodes, edges }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.selectAll("*").remove();
    const g = svg.append("g");

    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    svg.call(zoom);

    if (nodes[0]) {
      nodes[0].fx = width / 2;
      nodes[0].fy = height / 2;
    }

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
      .force("collision", d3.forceCollide().radius(40));

    const link = g
      .append("g")
      .attr("class", "edges")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", "#666")
      .attr("stroke-width", 2);

    const nodeGroup = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node-group");

    // First add text so we can measure it
const texts = nodeGroup
.append("text")
.text((d) => d.name)
.attr("text-anchor", "middle")
.attr("dy", 5)
.style("font-weight", "bold")
.style("font-size", "12px")
.style("pointer-events", "none"); // makes interaction easier

// Then add rects based on text size
nodeGroup.each(function (d, i) {
const group = d3.select(this);
const text = group.select("text");
const bbox = text.node().getBBox();
const padding = 10;

group
  .insert("rect", "text") // insert rect before text
  .attr("x", bbox.x - padding)
  .attr("y", bbox.y - padding)
  .attr("width", bbox.width + padding * 2)
  .attr("height", bbox.height + padding * 2)
  .attr("rx", 6)
  .attr("fill", "#fff")
  .attr("stroke", "#000")
  .attr("stroke-width", 2)
  .attr("filter", "drop-shadow(4px 4px 0px black)");
});

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
  }, [nodes, edges]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: "100vw",
        height: "100vh",
        border: "1px solid black",
      }}
    />
  );
}
