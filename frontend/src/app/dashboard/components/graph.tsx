"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function ordinal_suffix_of(i) {
  let j = i % 10,
      k = i % 100;
  if (j === 1 && k !== 11) {
      return i + "st";
  }
  if (j === 2 && k !== 12) {
      return i + "nd";
  }
  if (j === 3 && k !== 13) {
      return i + "rd";
  }
  return i + "th";
}

function Graph({ nodes, edges, highlightEdges=[], setQuery, obscure }) {
  const colorScale = d3.scaleLinear()
    .domain([0, d3.max(nodes, (d) => d.degree)])  // Range based on degree 0 to the max degree
    .range(["#88aaee", "#dae4f5"]);  // Lighter shades of #88aaee

  const highlightEdgeSet : string[] = [];
  if (highlightEdges.connections) {
    const highlightEdgeConnections = highlightEdges.connections;
    for (let i = 0; i < highlightEdgeConnections.length - 1; i++) {
      const from = highlightEdgeConnections[i].user_id;
      const to = highlightEdgeConnections[i + 1].user_id;
      highlightEdgeSet.push(`${from}-${to}`);
      highlightEdgeSet.push(`${to}-${from}`); // if edges are undirected
    }
  }

  const svgRef = useRef(null);

  const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3
      .forceLink(edges)
      .id((d) => d.id)
      .distance(160)
  )
  .force("charge", d3.forceManyBody().strength(-200))
  .force("collision", d3.forceCollide().radius(d => {
    const textLength = d.name.length + (d.degree ? 6 : 0); // Rough estimate
    const charWidth = 6.5; // Adjust based on font size
    const padding = 10;
    return (textLength * charWidth) / 2 + padding;
  }));

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

    let userNode = nodes.find(n => n.degree === 0);
    if (userNode) {
      userNode.fx = width / 2;
      userNode.fy = height / 2;
      userNode.fixed = true;
    }

    const link = g
      .append("g")
      .attr("class", "edges")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d) =>
        highlightEdgeSet.includes(`${d.source.id}-${d.target.id}`) ? "#3399ff" : "#666"
      )
      .attr("stroke-width", (d) =>
        highlightEdgeSet.includes(`${d.source.id}-${d.target.id}`) ? 4 : 2
      );

    const nodeGroup = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .on("click", (event, d) => {
        if ((!obscure || d.degree <= 2) && setQuery) {
          setQuery(d.name);
        }
      });

nodeGroup
.append("text")
.text((d) => obscure && d.degree > 2 ? `🔒` : `${d.name}${d.degree ? ` (${ordinal_suffix_of(d.degree)})` : "" }`)
.attr("text-anchor", "middle")
.attr("dy", 5)
.style("font-weight", "bold")
.style("font-size", "12px")
.style("pointer-events", "none"); 

nodeGroup.each(function () {
const group = d3.select(this);
const text = group.select("text");
const bbox = text.node().getBBox();
const padding = 10;

group
  .insert("rect", "text")
  .attr("x", bbox.x - padding)
  .attr("y", bbox.y - padding)
  .attr("width", bbox.width + padding * 2)
  .attr("height", bbox.height + padding * 2)
  .attr("rx", 6)
  .attr("fill", (d) => obscure && d.degree > 2 ? "#383838" : (highlightEdgeSet.find(c => c.startsWith(d.id) || c.endsWith(d.id)) ? ("#6ed8ff") : (colorScale(d.degree) || "#fff")))
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
  }, [nodes, edges, highlightEdges, setQuery, colorScale, highlightEdgeSet, simulation]);

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

export default React.memo(Graph);