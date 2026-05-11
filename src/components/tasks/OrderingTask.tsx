import React, { useState, useEffect } from 'react';
import { Reorder, motion } from 'motion/react';
import { Button } from '../ui/Button';

interface OrderingTaskProps {
  question: number[];
  prompt: string;
  onAnswer: (answer: number[]) => void;
}

export function OrderingTask({ question, prompt, onAnswer }: OrderingTaskProps) {
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    setItems(question);
  }, [question]);

  return (
    <div className="text-center w-full max-w-lg mx-auto pt-8 md:pt-12">
      <div className="mb-8">
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
          {items.map((item) => (
            <Reorder.Item
              key={item}
              value={item}
              className="bg-brand-blue text-white p-6 rounded-2xl flex items-center justify-between cursor-grab active:cursor-grabbing kid-shadow-sm"
            >
              <span className="text-4xl font-black">{item}</span>
              <div className="flex flex-col gap-1">
                <div className="w-8 h-1 bg-white/30 rounded-full" />
                <div className="w-8 h-1 bg-white/30 rounded-full" />
                <div className="w-8 h-1 bg-white/30 rounded-full" />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <Button
        size="xl"
        variant="primary"
        onClick={() => onAnswer(items)}
        className="w-full"
      >
        COMPROBAR
      </Button>
    </div>
  );
}
