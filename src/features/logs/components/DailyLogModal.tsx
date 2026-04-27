import React, { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { db } from '../../../lib/db';
import { X, Trash2 } from 'lucide-react';

const LOG_TYPES = [
  "weight", "feed", "temperature", "misting", "events", "flight", "water", "training", "general"
];

const formSchema = z.object({
  log_type: z.enum(LOG_TYPES as [string, ...string[]]),
  log_date: z.string(),
  notes: z.string().nullable().optional(),
  weight_grams: z.number().nullable().optional(),
  weight_unit: z.enum(['g', 'kg']).nullable().optional(),
  basking_temp_c: z.number().nullable().optional(),
  cool_temp_c: z.number().nullable().optional(),
  temperature_c: z.number().nullable().optional(),
});

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  animalId: string;
  existingLogId?: string;
  initialType?: string;
}

export function DailyLogModal({ isOpen, onClose, animalId, existingLogId, initialType }: DailyLogModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      log_type: (initialType || 'general') as any,
      log_date: new Date().toISOString().slice(0, 16),
      notes: null,
      weight_grams: null,
      weight_unit: 'g',
      basking_temp_c: null,
      cool_temp_c: null,
      temperature_c: null,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const params = [
          animalId,
          value.log_type,
          value.log_date,
          value.notes || null,
          value.weight_grams ?? null,
          value.weight_unit ?? null,
          value.basking_temp_c ?? null,
          value.cool_temp_c ?? null,
          value.temperature_c ?? null,
        ];

        if (existingLogId) {
          await db.query(
            `UPDATE daily_logs SET log_type = $2, log_date = $3, notes = $4, weight_grams = $5, weight_unit = $6, basking_temp_c = $7, cool_temp_c = $8, temperature_c = $9, updated_at = now() WHERE id = $10`,
            [...params, existingLogId]
          );
        } else {
          await db.query(
            `INSERT INTO daily_logs (animal_id, log_type, log_date, notes, weight_grams, weight_unit, basking_temp_c, cool_temp_c, temperature_c, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), now())`,
            params
          );
        }
        onClose();
      } catch (err) {
        console.error('Mutation error:', err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (existingLogId && isOpen) {
      db.query('SELECT log_type, log_date, notes, weight_grams, weight_unit, basking_temp_c, cool_temp_c, temperature_c FROM daily_logs WHERE id = $1', [existingLogId]).then((res) => {
        if (res.rows[0]) {
          const row = res.rows[0];
          form.setOptions({
            defaultValues: {
              log_type: row.log_type,
              log_date: row.log_date.slice(0, 16),
              notes: row.notes,
              weight_grams: row.weight_grams,
              weight_unit: row.weight_unit,
              basking_temp_c: row.basking_temp_c,
              cool_temp_c: row.cool_temp_c,
              temperature_c: row.temperature_c,
            }
          });
        }
      });
    }
  }, [existingLogId, isOpen]);

  const handleDelete = async () => {
    if (existingLogId) {
      await db.query(`UPDATE daily_logs SET is_deleted = true, updated_at = now() WHERE id = $1`, [existingLogId]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md text-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{existingLogId ? 'Edit Log' : 'New Log'}</h2>
          <button onClick={onClose} className="hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
          <form.Field name="log_date" children={(field) => (
            <div>
              <label className="block text-sm mb-1 text-slate-400">Date</label>
              <input type="datetime-local" {...field.getInputProps()} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
            </div>
          )} />
          <form.Field name="log_type" children={(field) => (
            <div>
              <label className="block text-sm mb-1 text-slate-400">Type</label>
              <select {...field.getInputProps()} className="w-full bg-slate-800 p-2 rounded border border-slate-700">
                {LOG_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          )} />
          
          <form.StateSelector selector={(state) => state.values.log_type}>
            {(logType) => (
              <>
                {logType === 'weight' && (
                  <>
                    <form.Field name="weight_grams" children={(field) => (
                      <div>
                        <label className="block text-sm mb-1 text-slate-400">Weight (grams)</label>
                        <input type="number" {...field.getInputProps({type: 'number', valueAsNumber: true})} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                      </div>
                    )} />
                  </>
                )}
                {['temperature'].includes(logType) && (
                  <>
                    <form.Field name="temperature_c" children={(field) => (
                      <div>
                        <label className="block text-sm mb-1 text-slate-400">Temperature (°C)</label>
                        <input type="number" {...field.getInputProps({type: 'number', valueAsNumber: true})} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                      </div>
                    )} />
                  </>
                )}
                {['feed', 'misting', 'events', 'flight', 'water', 'training', 'general'].includes(logType) && (
                  <form.Field name="notes" children={(field) => (
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">Notes</label>
                      <textarea {...field.getInputProps()} className="w-full bg-slate-800 p-2 rounded border border-slate-700 min-h-[100px]" />
                    </div>
                  )} />
                )}
              </>
            )}
          </form.StateSelector>

          <div className="flex justify-between mt-6">
            {existingLogId && <button type="button" onClick={handleDelete} className="text-red-400 hover:text-red-300 flex items-center gap-1"><Trash2 size={16} /> Delete</button>}
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold w-full">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
