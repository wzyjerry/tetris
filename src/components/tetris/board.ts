import * as d3 from 'd3';
import { Board, Status } from './tetromino';

const init = (g: d3.Selection<SVGGElement, Board, SVGSVGElement, any>) => {
  g.selectAll('.outer-border')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'outer-border')
    .attr('x', 12)
    .attr('y', 12)
    .attr('width', 528)
    .attr('height', 1008)
    .attr('fill', 'black');
  g.selectAll('.outer')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'outer')
    .attr('x', 20)
    .attr('y', 20)
    .attr('width', 512)
    .attr('height', 992)
    .attr('fill', 'white');
  // 绘制内边框
  g.selectAll('.inner-border')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'inner-border')
    .attr('x', 32)
    .attr('y', 32)
    .attr('width', 488)
    .attr('height', 968)
    .attr('fill', 'black');
  g.selectAll('.inner')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'inner')
    .attr('x', 36)
    .attr('y', 36)
    .attr('width', 480)
    .attr('height', 960)
    .attr('fill', 'white');
  // next
  g.selectAll('.next-outer-border')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'next-outer-border')
    .attr('x', 552)
    .attr('y', 12)
    .attr('width', 240)
    .attr('height', 144)
    .attr('fill', 'black');
  g.selectAll('.next-outer')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'next-outer')
    .attr('x', 560)
    .attr('y', 20)
    .attr('width', 224)
    .attr('height', 128)
    .attr('fill', 'white');
  // 绘制next内边框
  g.selectAll('.next-inner-border')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'next-inner-border')
    .attr('x', 572)
    .attr('y', 32)
    .attr('width', 200)
    .attr('height', 104)
    .attr('fill', 'black');
  g.selectAll('.next-inner')
    .data([1])
    .enter()
    .append('rect')
    .attr('class', 'next-inner')
    .attr('x', 576)
    .attr('y', 36)
    .attr('width', 192)
    .attr('height', 96)
    .attr('fill', 'white');
};

const renderMain = (
  g: d3.Selection<SVGGElement, Board, SVGSVGElement, any>,
  board: Board,
) => {
  const rows = g.selectAll<SVGGElement, Status[]>('.box-row').data(board);
  rows.exit().remove();
  const rowsEnter = rows.enter().append('g').attr('class', 'box-row');
  rowsEnter.attr('transform', (d, i) => {
    return `translate(0 ${48 * i})`;
  });
  const rowsUpdate = rows.merge(rowsEnter);
  const boxes = rowsUpdate
    .selectAll<SVGGElement, Status>('.box')
    .data((d) => d);
  boxes.exit().remove();
  const boxesEnter = boxes.enter().append('g').attr('class', 'box');
  boxesEnter.each((data, index, groups) => {
    const g = d3.select(groups[index]);
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 48)
      .attr('height', 48)
      .attr('fill', 'black');
    g.append('rect')
      .attr('x', 4)
      .attr('y', 4)
      .attr('width', 40)
      .attr('height', 40)
      .attr('fill', 'white');
    g.append('rect')
      .classed('square', true)
      .attr('x', 8)
      .attr('y', 8)
      .attr('width', 32)
      .attr('height', 32);
  });
  boxesEnter.attr('transform', (d, i) => {
    return `translate(${48 * i} 0)`;
  });
  const boxesUpdate = boxes.merge(boxesEnter);
  boxesUpdate.attr('class', (d) => {
    return `box${d.status === Status.Fill ? ` ${d.kind.toString()} fill` : ''}`;
  });
};

const renderScore = (
  g: d3.Selection<SVGGElement, string[], SVGSVGElement, any>,
  hints: string[],
  states: string[],
) => {
  const texts = g.selectAll<SVGTextElement, string[]>('.hint').data(hints);
  texts.exit().remove();
  const textsEnter = texts
    .enter()
    .append('text')
    .attr('class', 'hint')
    .attr('x', 0)
    .attr('y', (d, i) => 48 * i);
  const textsUpdate = texts.merge(textsEnter);
  textsUpdate.html((d) => d);

  const scoreText = g
    .selectAll<SVGTextElement, string[]>('.state')
    .data(states);
  scoreText.exit().remove();
  const scoreTextEnter = scoreText
    .enter()
    .append('text')
    .attr('class', 'state')
    .attr('x', 0)
    .attr('y', (d, i) => 48 * (hints.length + i));
  const scoreTextUpdate = scoreText.merge(scoreTextEnter);
  scoreTextUpdate.html((d) => d);
};

export { init, renderMain, renderScore };
