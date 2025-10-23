'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun, Wind } from 'lucide-react';
import * as React from 'react';

interface WeatherSelectorProps {
  temperature?: number;
  description?: string;
  onTemperatureChange: (temp: number) => void;
  onDescriptionChange: (desc: string) => void;
}

const WEATHER_OPTIONS = [
  { value: 'sunny', label: 'Sunny', icon: Sun },
  { value: 'cloudy', label: 'Cloudy', icon: Cloud },
  { value: 'partly cloudy', label: 'Partly Cloudy', icon: CloudSun },
  { value: 'rainy', label: 'Rainy', icon: CloudRain },
  { value: 'stormy', label: 'Stormy', icon: CloudRain },
  { value: 'windy', label: 'Windy', icon: Wind },
  { value: 'snowy', label: 'Snowy', icon: CloudSnow },
  { value: 'foggy', label: 'Foggy', icon: Cloud },
] as const;

export const WeatherSelector: React.FC<WeatherSelectorProps> = ({
  temperature,
  description,
  onTemperatureChange,
  onDescriptionChange,
}) => {
  const selectedWeather = WEATHER_OPTIONS.find((w) => w.value === description);
  const IconComponent = selectedWeather?.icon;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="temperature">Temperature (°C)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="temperature"
            name="temperature"
            type="number"
            placeholder="20"
            value={temperature ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              onTemperatureChange(value ? parseInt(value, 10) : 0);
            }}
            className="max-w-[120px]"
          />
          <span className="text-muted-foreground text-sm">degrees Celsius</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="weather-description">Weather Condition</Label>
        <Select
          value={description || ''}
          onValueChange={onDescriptionChange}
          name="weather-description"
        >
          <SelectTrigger
            id="weather-description"
            aria-labelledby="weather-description-label"
          >
            <SelectValue placeholder="Select weather condition">
              {selectedWeather && (
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{selectedWeather.label}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {WEATHER_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
