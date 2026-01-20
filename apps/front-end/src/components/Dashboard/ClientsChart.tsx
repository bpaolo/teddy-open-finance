import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Client } from '../../types/client.types';
import './ClientsChart.css';

interface ClientsChartProps {
  clients: Client[];
}

export const ClientsChart: React.FC<ClientsChartProps> = ({ clients }) => {
  // Empty State: Se não houver clientes, mostrar mensagem amigável
  if (clients.length === 0) {
    return (
      <div className="chart-container">
        <h3>Top 5 Clientes por Acessos</h3>
        <div className="empty-chart-message">
          <p>📊 Nenhum cliente cadastrado ainda.</p>
          <p className="empty-subtitle">Os dados do gráfico aparecerão aqui quando houver clientes.</p>
        </div>
      </div>
    );
  }

  // Ordenar lista e mostrar apenas os 5 clientes com mais acessos
  const topClients = [...clients]
    .sort((a, b) => b.access_count - a.access_count)
    .slice(0, 5)
    .map((client) => ({
      name: client.nome, // Eixo X: name do cliente
      access_count: client.access_count, // Eixo Y: access_count
      email: client.email, // Email para tooltip personalizado
    }));

  // Tooltip personalizado para mostrar email
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${data.name}`}</p>
          <p className="tooltip-email">{`Email: ${data.email}`}</p>
          <p className="tooltip-value">{`Acessos: ${data.access_count}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3>Top 5 Clientes por Acessos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topClients}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="access_count" fill="#667eea" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
