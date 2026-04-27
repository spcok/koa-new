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
  weight_grams: z.union([z.number(), z.string()]).nullable().optional(),
  weight_unit: z.enum(['g', 'kg']).nullable().optional(),
  basking_temp_c: z.union([z.number(), z.string()]).nullable().optional(),
  cool_temp_c: z.union([z.number(), z.string()]).nullable().optional(),
  temperature_c: z.union([z.number(), z.string()]).nullable().optional(),
});

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  animalId: string;
  existingLogId?: string;
  initialType?: string;
}

export function DailyLogModal(props: DailyLogModalProps) {
  const [isFetching, setIsFetching] = useState(!!props.existingLogId);
  const [initialData, setInitialData] = useState({
    log_type: (props.initialType || 'general') as any,
    log_date: new Date().toISOString().slice(0, 16),
    notes: 'NONE',
    weight_grams: "" as any,
    weight_unit: 'g',
    basking_temp_c: "" as any,
    cool_temp_c: "" as any,
    temperature_c: "" as any,
  });

  useEffect(() => {
    if (props.existingLogId && props.isOpen) {
      setIsFetching(true);
      db.query('SELECT log_type, log_date, notes, weight_grams, weight_unit, basking_temp_c, cool_temp_c, temperature_c FROM daily_logs WHERE id = $1', [props.existingLogId]).then((res) => {
        if (res.rows[0]) {
          const row = res.rows[0];
          const parsedDate = row.log_date ? new Date(row.log_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
          setInitialData({
            log_type: row.log_type,
            log_date: parsedDate,
            notes: row.notes,
            weight_grams: row.weight_grams === -1 ? "" : row.weight_grams,
            weight_unit: row.weight_unit,
            basking_temp_c: row.basking_temp_c === -1 ? "" : row.basking_temp_c,
            cool_temp_c: row.cool_temp_c === -1 ? "" : row.cool_temp_c,
            temperature_c: row.temperature_c === -1 ? "" : row.temperature_c,
          });
        }
        setIsFetching(false);
      });
    }
  }, [props.existingLogId, props.isOpen]);

  if (!props.isOpen) return null;
  if (isFetching) return <div className="fixed inset-0 bg-slate-900/80 flex justify-center items-center z-50 text-emerald-400 font-mono">Loading data from vault...</div>;

  return <DailyLogForm {...props} initialData={initialData} />;
}

function DailyLogForm({ isOpen, onClose, animalId, existingLogId, initialData }: DailyLogModalProps & { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [logType, setLogType] = useState(initialData.log_type);

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: initialData,
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const safeWeight = (value.weight_grams === "" || value.weight_grams === undefined || value.weight_grams === null) ? -1 : Number(value.weight_grams);
        const safeBasking = (value.basking_temp_c === "" || value.basking_temp_c === undefined || value.basking_temp_c === null) ? -1 : Number(value.basking_temp_c);
        const safeCool = (value.cool_temp_c === "" || value.cool_temp_c === undefined || value.cool_temp_c === null) ? -1 : Number(value.cool_temp_c);
        const safeTemp = (value.temperature_c === "" || value.temperature_c === undefined || value.temperature_c === null) ? -1 : Number(value.temperature_c);
        const safeNotes = value.notes ? String(value.notes).trim() : 'NONE';
        const zeroUUID = '00000000-0000-0000-0000-000000000000';

        const params = [
          animalId,
          value.log_type,
          value.log_date,
          safeNotes,
          safeWeight,
          value.weight_unit ?? 'g',
          safeBasking,
          safeCool,
          safeTemp,
        ];

        if (existingLogId) {
          await db.query(
            `UPDATE daily_logs SET log_type = $2, log_date = $3, notes = $4, weight_grams = $5, weight_unit = $6, basking_temp_c = $7, cool_temp_c = $8, temperature_c = $9, updated_at = now(), modified_by = $11 WHERE id = $10`,
            [...params, existingLogId, zeroUUID]
          );
        } else {
          await db.query(
            `INSERT INTO daily_logs (animal_id, log_type, log_date, notes, weight_grams, weight_unit, basking_temp_c, cool_temp_c, temperature_c, created_at, updated_at, created_by, modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), now(), $10, $10)`,
            [...params, zeroUUID]
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

  const handleDelete = async () => {
    if (existingLogId) {
      await db.query(`UPDATE daily_logs SET is_deleted = true, updated_at = now(), modified_by = '00000000-0000-0000-0000-000000000000' WHERE id = $1`, [existingLogId]);
      onClose();
    }
  };

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
              <input type="datetime-local" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
            </div>
          )} />
          <form.Field name="log_type" children={(field) => (
            <div>
              <label className="block text-sm mb-1 text-slate-400">Type</label>
              <select name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {
                const val = e.target.value;
                field.handleChange(val as any);
                setLogType(val);
              }} className="w-full bg-slate-800 p-2 rounded border border-slate-700">
                {LOG_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          )} />
          
          <>
            {logType === 'weight' && (
              <form.Field name="weight_grams" children={(field) => (
                <div>
                  <label className="block text-sm mb-1 text-slate-400">Weight (grams)</label>
                  <input type="number" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => { const val = e.target.valueAsNumber; field.handleChange(isNaN(val) ? "" : val); }} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                </div>
              )} />
            )}
            {['temperature'].includes(logType) && (
              <form.Field name="temperature_c" children={(field) => (
                <div>
                  <label className="block text-sm mb-1 text-slate-400">Temperature (°C)</label>
                  <input type="number" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => { const val = e.target.valueAsNumber; field.handleChange(isNaN(val) ? "" : val); }} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                </div>
              )} />
            )}
            {['feed', 'misting', 'events', 'flight', 'water', 'training', 'general'].includes(logType) && (
              <form.Field name="notes" children={(field) => (
                <div>
                  <label className="block text-sm mb-1 text-slate-400">Notes</label>
                  <textarea name={field.name} value={field.state.value || ''} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-700 min-h-[100px]" />
                </div>
              )} />
            )}
          </>

          <div className="flex justify-between mt-6">
            {existingLogId && <button type="button" onClick={handleDelete} className="text-red-400 hover:text-red-300 flex items-center gap-1"><Trash2 size={16} /> Delete</button>}
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold w-full">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
