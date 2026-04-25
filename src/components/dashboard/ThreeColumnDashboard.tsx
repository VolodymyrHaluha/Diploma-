
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { generateAdminContent } from '@/ai/flows/admin-content-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Calendar as CalendarIcon, Users, TrendingUp, Newspaper } from 'lucide-react';

const COLORS = ['#66CCFF', '#26D9BA', '#FF9933', '#A17FFF'];

const visitorData = [
  { id: '1024', name: 'Олександр Іванов', class: 'High Intensity HIIT', status: 'В залі', progress: 85 },
  { id: '1025', name: 'Марія Коваль', class: 'Vinyasa Yoga', status: 'Активний', progress: 45 },
  { id: '1026', name: 'Михайло Петренко', class: 'Power Lifting', status: 'В залі', progress: 10 },
  { id: '1027', name: 'Емма Вілсон', class: 'Zumba Dance', status: 'Очікується', progress: 0 },
];

const attendancePie = [
  { name: 'Щоденно', value: 400 },
  { name: 'Щотижня', value: 300 },
  { name: 'Щомісяця', value: 200 },
];

const equipmentUsage = [
  { name: 'Доріжки', val: 95 },
  { name: 'Ваги', val: 82 },
  { name: 'Цикли', val: 45 },
  { name: 'Мат', val: 60 },
];

const trendData = [
  { day: 'Пн', count: 120 },
  { day: 'Вт', count: 150 },
  { day: 'Ср', count: 180 },
  { day: 'Чт', count: 140 },
  { day: 'Пт', count: 210 },
  { day: 'Сб', count: 250 },
  { day: 'Нд', count: 190 },
];

export function ThreeColumnDashboard() {
  const [news, setNews] = useState([
    { id: 1, title: 'Відкриття нової кардіо зони', date: '15 травня, 2024', tag: 'Клубні новини' },
    { id: 2, title: 'Літня акція на абонементи', date: '12 травня, 2024', tag: 'Промоція' },
    { id: 3, title: 'Переваги ранкових тренувань', date: '10 травня, 2024', tag: 'Стаття' },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [newTopic, setNewTopic] = useState('');

  const handleGenerateNews = async () => {
    if (!newTopic) return;
    setIsGenerating(true);
    try {
      const result = await generateAdminContent({
        type: 'news_post_draft',
        topic: newTopic
      });
      const newPost = {
        id: Date.now(),
        title: result.generatedContent.slice(0, 50) + "...",
        date: new Date().toLocaleDateString('uk-UA', { month: 'short', day: 'numeric', year: 'numeric' }),
        tag: 'ШІ Генерація'
      };
      setNews([newPost, ...news]);
      setNewTopic('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-[5px]">
          
          {/* LEFT BLOCK - Visitors */}
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center gap-2">
              <Users className="text-primary w-5 h-5" />
              <CardTitle className="font-headline text-lg">Активні учасники</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-white/10">
                    <TableHead className="text-xs uppercase text-muted-foreground">ID</TableHead>
                    <TableHead className="text-xs uppercase text-muted-foreground">Учасник</TableHead>
                    <TableHead className="text-xs uppercase text-muted-foreground">Клас</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitorData.map((v) => (
                    <TableRow key={v.id} className="border-b-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-mono text-xs text-primary">{v.id}</TableCell>
                      <TableCell className="font-medium">
                        <div>{v.name}</div>
                        <div className="mt-1">
                          <Progress value={v.progress} className="h-1 bg-white/10" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary whitespace-nowrap">
                          {v.class}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="text-sm font-semibold mb-2">Пікові години</div>
                <div className="flex items-end gap-1 h-12">
                  {[30, 45, 90, 60, 40, 70, 100, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CENTER BLOCK - News Feed */}
          <Card className="glass-card h-full border-x-0 lg:border-x">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="text-secondary w-5 h-5" />
                <CardTitle className="font-headline text-lg">Новини Zenith</CardTitle>
              </div>
              <CalendarIcon className="text-muted-foreground w-4 h-4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="ШІ: Нова тема для новин..." 
                    className="bg-white/5 border-white/10 text-sm h-9"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                  />
                  <Button 
                    size="sm" 
                    className="bg-primary text-background"
                    onClick={handleGenerateNews}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "..." : <Sparkles className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {news.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-secondary/30 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary text-[10px] uppercase font-bold px-1.5 py-0">
                          {item.tag}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{item.date}</span>
                      </div>
                      <h4 className="font-medium text-sm group-hover:text-secondary transition-colors">{item.title}</h4>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Calendar mode="single" className="scale-90 origin-top mx-auto p-0" />
              </div>
            </CardContent>
          </Card>

          {/* RIGHT BLOCK - Stats */}
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center gap-2">
              <TrendingUp className="text-secondary w-5 h-5" />
              <CardTitle className="font-headline text-lg">Аналітика клубу</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="h-[150px]">
                <div className="text-xs uppercase text-muted-foreground mb-2 font-bold tracking-widest">Тренди відвідування</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line type="monotone" dataKey="count" stroke="#66CCFF" strokeWidth={3} dot={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#141B1F', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-[120px] flex flex-col items-center">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1 font-bold">Частота</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={attendancePie} innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                        {attendancePie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[120px] flex flex-col items-center">
                  <div className="text-[10px] uppercase text-muted-foreground mb-1 font-bold">Тренажери</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={equipmentUsage}>
                      <Bar dataKey="val" fill="#26D9BA" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-muted-foreground">Завантаженість</span>
                  <span className="text-xs font-bold text-secondary">68%</span>
                </div>
                <Progress value={68} className="h-2 bg-white/10" />
                <p className="text-[10px] text-muted-foreground mt-2 italic">Оптимальний час: Пн-Ср після 20:00</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
