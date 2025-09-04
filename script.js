document.addEventListener('DOMContentLoaded', () => {
  // Example genealogical data. Expand or load dynamically as needed.
  const data = {
    name: 'Иванов Иван Петрович',
    years: '1920–1980',
    profession: 'Учитель',
    residence: 'Москва',
    children: [
      {
        name: 'Иванова Анна Ивановна',
        years: '1945–2005',
        profession: 'Врач',
        residence: 'Санкт-Петербург'
      },
      {
        name: 'Иванов Сергей Иванович',
        years: '1950–2010',
        profession: 'Инженер',
        residence: 'Новосибирск',
        children: [
          {
            name: 'Иванова Мария Сергеевна',
            years: '1975–',
            profession: 'Программист',
            residence: 'Екатеринбург'
          },
          {
            name: 'Иванов Алексей Сергеевич',
            years: '1980–',
            profession: 'Предприниматель',
            residence: 'Москва'
          }
        ]
      }
    ]
  };

  const tooltip = d3.select('#tooltip');
  const container = document.getElementById('tree-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select('#tree-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(40,40)');

  const root = d3.hierarchy(data);
  const treeLayout = d3.tree().size([height - 80, width - 160]);
  treeLayout(root);

  // Draw links between nodes
  svg.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x)
    );

  // Draw node groups
  const node = svg.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  // Node rectangle with tooltip events
  node.append('rect')
    .attr('width', 160)
    .attr('height', 60)
    .attr('x', -80)
    .attr('y', -30)
    .on('mouseover', (event, d) => {
      tooltip
        .style('opacity', 1)
        .html(`
          <strong>${d.data.name}</strong><br>
          Годы жизни: ${d.data.years}<br>
          Род деятельности: ${d.data.profession}<br>
          Где жил: ${d.data.residence}
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 20) + 'px');
    })
    .on('mousemove', event => {
      tooltip
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 20) + 'px');
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0);
    });

  // Primary text (name)
  node.append('text')
    .attr('dy', '-5')
    .attr('text-anchor', 'middle')
    .text(d => d.data.name);

  // Secondary text (years)
  node.append('text')
    .attr('dy', '12')
    .attr('text-anchor', 'middle')
    .attr('class', 'years')
    .attr('fill', '#666')
    .text(d => d.data.years);
});
