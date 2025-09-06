import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { publicService } from '../../services/public.service';

interface ChartData {
  month: string;
  [key: string]: any;
}

interface ChartLine {
  key: string;
  color: string;
}

interface LpgBbmChartProps {
  type: 'lpg' | 'bbm';
  title: string;
  className?: string;
}

const LpgBbmChart: React.FC<LpgBbmChartProps> = ({ type, title, className = '' }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartLines, setChartLines] = useState<ChartLine[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dropdown states
  const [agens, setAgens] = useState<any[]>([]);
  const [spbus, setSpbus] = useState<any[]>([]);
  const [selectedAgenId, setSelectedAgenId] = useState<string>('');
  const [selectedSpbuId, setSelectedSpbuId] = useState<string>('');

  const fetchChartData = async (year: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (type === 'lpg') {
        const agenId = selectedAgenId ? parseInt(selectedAgenId) : undefined;
        response = await publicService.getLpgChartData(year, agenId);
      } else {
        const spbuId = selectedSpbuId ? parseInt(selectedSpbuId) : undefined;
        response = await publicService.getBbmChartData(year, spbuId);
      }
      
      setChartData(response.chartData || []);
      setChartLines(response.chartLines || []);
    } catch (err) {
      console.error(`Error fetching ${type} chart data:`, err);
      setError(`Gagal memuat data chart ${type.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      if (type === 'lpg') {
        const agensData = await publicService.getAgen();
        setAgens(agensData);
      } else {
        const spbusData = await publicService.getSpbu();
        setSpbus(spbusData);
      }
    } catch (err) {
      console.error(`Error fetching ${type} dropdown data:`, err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, [type]);

  useEffect(() => {
    fetchChartData(selectedYear);
  }, [selectedYear, type, selectedAgenId, selectedSpbuId]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const formatTooltipValue = (value: any, name: string) => {
    if (type === 'lpg') {
      return [`${value.toLocaleString()} tabung`, name];
    } else {
      return [`${value.toLocaleString()} liter`, name];
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
          onClick={() => fetchChartData(selectedYear)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Coba Lagi
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">
            Realisasi bulanan {type.toUpperCase()} tahun {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Dropdown untuk Agen/SPBU */}
          <div className="flex items-center gap-2">
            <label htmlFor={`${type}-select-${type}`} className="text-sm font-medium text-gray-700">
              {type === 'lpg' ? 'Agen:' : 'SPBU:'}
            </label>
            <select
              id={`${type}-select-${type}`}
              value={type === 'lpg' ? selectedAgenId : selectedSpbuId}
              onChange={(e) => {
                if (type === 'lpg') {
                  setSelectedAgenId(e.target.value);
                } else {
                  setSelectedSpbuId(e.target.value);
                }
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
            >
              <option value="">Semua {type === 'lpg' ? 'Agen' : 'SPBU'}</option>
              {type === 'lpg' 
                ? agens.map(agen => (
                    <option key={agen.id_agen} value={agen.id_agen}>
                      {agen.nama_usaha}
                    </option>
                  ))
                : spbus.map(spbu => (
                    <option key={spbu.id_spbu} value={spbu.id_spbu}>
                      {spbu.nama_usaha || spbu.no_spbu}
                    </option>
                  ))
              }
            </select>
          </div>
          
          {/* Dropdown untuk Tahun */}
          <div className="flex items-center gap-2">
            <label htmlFor={`year-select-${type}`} className="text-sm font-medium text-gray-700">
              Tahun:
            </label>
            <select
              id={`year-select-${type}`}
              value={selectedYear}
              onChange={handleYearChange}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {generateYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data untuk tahun {selectedYear}</p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: '#333' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Legend />
              {chartLines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: line.color, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LpgBbmChart;