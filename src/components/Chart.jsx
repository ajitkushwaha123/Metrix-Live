import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page A',
    uv: 1000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page A',
    uv: 5000,
    pv: 2400,
    amt: 2400,
  },
  // ... other data entries ...
];

const Chart = () => {
  return (
    <ResponsiveContainer width={300} height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar type="monotone" dataKey="uv" stroke="#2563eb" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
//         <p className="text-medium text-lg">{label}</p>
//         <p className="text-sm text-primary">
//           Product 1:
//           <span className="ml-2">${payload[0].value}</span>
//         </p>
//         <p className="text-sm text-primary">
//           Product 2:
//           <span className="ml-2">${payload[1].value}</span>
//         </p>
//       </div>
//     );
//   }
// };

export default Chart;
