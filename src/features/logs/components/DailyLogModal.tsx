import React, { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { X, Trash2 } from 'lucide-react';
import { db } from '../../../lib/db';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  animalId: string;
  existingLogId?: string;
}

const logSchema = z.object({
  log_type: z.enum(['OBSERVATION', 'MEDICAL', 'HUSBANDRY']),
  log_date: z.string(),
  weight_grams: z.number().nullable().optional(),
  notes: z.string().optional(),
});

function toDateTimeLocal(date: Date) {
  const tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num: number) {
          const norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
      };
  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes());
}

export function DailyLogModal({ isOpen, onClose, animalId, existingLogId }: DailyLogModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      log_type: 'OBSERVATION' as const,
      log_date: toDateTimeLocal(new Date()),
      weight_grams: null as number | null | undefined,
      notes: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: logSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        if (existingLogId) {
          const query = `
            UPDATE daily_logs 
            SET log_type = $1, log_date = $2, notes = $3, weight_grams = $4, updated_at = now() 
            WHERE id = $5
          `;
          await db.query(query, [
            value.log_type, 
            new Date(value.log_date), 
            value.notes || null, 
            value.weight_grams ?? null, 
            existingLogId
          ]);
        } else {
          const query = `
            INSERT INTO daily_logs (animal_id, log_type, log_date, notes, weight_grams, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, now(), now())
          `;
          await db.query(query, [
            animalId,
            value.log_type,
            new Date(value.log_date),
            value.notes || null,
            value.weight_grams ?? null,
          ]);
        }
        onClose();
      } catch (err) {
        console.error("Error saving log:", err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    async function loadLog() {
      if (!existingLogId) return;
      try {
        const res = await db.query('SELECT log_type, log_date, notes, weight_grams FROM daily_logs WHERE id = $1', [existingLogId]);
        if (res.rows.length > 0) {
          const row = res.rows[0] as any;
          form.setFieldValue('log_type', row.log_type);
          form.setFieldValue('log_date', toDateTimeLocal(new Date(row.log_date)));
          form.setFieldValue('notes', row.notes || '');
          form.setFieldValue('weight_grams', row.weight_grams != null ? Number(row.weight_grams) : null);
        }
      } catch (err) {
        console.error("Error loading log:", err);
      }
    }

    if (isOpen && existingLogId) {
      loadLog();
    } else if (isOpen && !existingLogId) {
      form.reset();
      form.setFieldValue('log_date', toDateTimeLocal(new Date()));
    }
  }, [isOpen, existingLogId, form]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!existingLogId) return;
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    
    setIsLoading(true);
    try {
      await db.query('UPDATE daily_logs SET is_deleted = true, updated_at = now() WHERE id = $1', [existingLogId]);
      onClose();
    } catch (err) {
      console.error("Error deleting log:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          {existingLogId ? 'Edit Daily Log' : 'New Daily Log'}
        </h2>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="log_type"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Log Type *</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="OBSERVATION">Observation</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="HUSBANDRY">Husbandry</option>
                </select>
              </div>
            )}
          />

          <form.Field
            name="log_date"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}
          />

          <form.Field
            name="weight_grams"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Weight (grams)</label>
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value === null ? '' : field.state.value}
                  onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. 250"
                />
              </div>
            )}
          />

          <form.Field
            name="notes"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter detailed observations..."
                />
              </div>
            )}
          />

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
            {existingLogId ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Log
              </button>
            ) : (
              <div></div>
            )}
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isLoading}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isSubmitting || isLoading ? 'Saving...' : 'Save Log'}
                  </button>
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
