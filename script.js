document.addEventListener('DOMContentLoaded', () => {
  // Genealogical data for Порошин Николай Михайлович (2006)
  // Нормализованная структура: от корня идут только две ветви — к отцу и матери
  const data = {
    name: 'Порошин Николай Михайлович (2006)',
    children: [
      // Отец
      {
        name: 'Порошин Михаил Юрьевич',
        years: '–',
        profession: '',
        residence: 'Новосибирск',
        // Предки по отцовской линии пока не указаны
        children: []
      },
      // Мать
      {
        name: 'Порошина Елена Александровна',
        years: '–',
        profession: '',
        residence: 'Новосибирск',
        children: [
          // Дедушка по маме
          {
            name: 'Титов Александр (Леонид) Михайлович',
            years: '20.06.1933–01.10.2002',
            profession: '',
            residence: 'рожд. Матвеевка (позднее — Новосибирск)',
            children: [
              {
                name: 'Титова Елизавета Александровна (урожд. Савельева)',
                years: '25.10.1898–13.04.1972',
                profession: '',
                residence: 'Мордовия → Матвеевка, Новосибирск',
                children: []
              }
            ]
          },
          // Бабушка по маме
          {
            name: 'Титова Ольга Ивановна (урожд. Аткина)',
            years: '05.08.1937–',
            profession: 'Сельхозработница (ферма, поле)',
            residence: 'рожд. с. Пичпанда (Мордовия); проживала Новосибирск, пос. Матвеевка',
            children: [
              {
                name: 'Аткин Иван Осипович',
                years: '13.06.1908–1954/1952',
                profession: 'Шофёр, рядовой РККА (советско-финская война; ВОВ)',
                residence: 'с. Пичпанда (Мордовия) → Новосибирск',
                children: []
              },
              {
                name: 'Аткина Федосья Афанасьевна (урожд. Сафаева)',
                years: '15.06.1908–29.11.2003',
                profession: '',
                residence: 'рожд. с. Пичпанда (Мордовия); позже Матвеевка, Новосибирск',
                children: []
              }
            ]
          }
        ]
      }
    ]
  };

  const tooltip = d3.select('#tooltip');
  const container = document.getElementById('tree-container');
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const svg = d3.select('#tree-container')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', '100%')
    .attr('height', '100%')
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
