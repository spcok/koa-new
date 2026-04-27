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
  weight_unit: z.enum(['g', 'kg', '-1']).nullable().optional(),
  basking_temp_c: z.union([z.number(), z.string()]).nullable().optional(),
  cool_temp_c: z.union([z.number(), z.string()]).nullable().optional(),
  temperature_c: z.union([z.number(), z.string()]).nullable().optional(),
  food: z.string().nullable().optional(),
  quantity: z.union([z.number(), z.string()]).nullable().optional(),
  feed_time: z.string().nullable().optional(),
  feed_method: z.string().nullable().optional(),
  cast_status: z.string().nullable().optional(),
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
    weight_unit: '-1',
    basking_temp_c: "" as any,
    cool_temp_c: "" as any,
    temperature_c: "" as any,
    food: '',
    quantity: '',
    feed_time: '',
    feed_method: '',
    cast_status: 'N/A',
  });

  useEffect(() => {
    if (props.existingLogId && props.isOpen) {
      setIsFetching(true);
      db.query('SELECT log_type, log_date, notes, weight_grams, weight_unit, basking_temp_c, cool_temp_c, temperature_c, food, quantity, feed_time, feed_method, cast_status FROM daily_logs WHERE id = $1', [props.existingLogId]).then((res) => {
        if (res.rows[0]) {
          const row = res.rows[0];
          const parsedDate = row.log_date ? new Date(row.log_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
          setInitialData({
            log_type: row.log_type,
            log_date: parsedDate,
            notes: row.notes,
            weight_grams: row.weight_grams === -1 ? "" : row.weight_grams,
            weight_unit: row.weight_unit === '-1' ? "-1" : row.weight_unit,
            basking_temp_c: row.basking_temp_c === -1 ? "" : row.basking_temp_c,
            cool_temp_c: row.cool_temp_c === -1 ? "" : row.cool_temp_c,
            temperature_c: row.temperature_c === -1 ? "" : row.temperature_c,
            food: row.food === 'N/A' ? "" : row.food,
            quantity: row.quantity === -1 ? "" : row.quantity,
            feed_time: row.feed_time === '00:00:00' ? "" : row.feed_time,
            feed_method: row.feed_method === 'N/A' ? "" : row.feed_method,
            cast_status: row.cast_status,
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
        const finalAnimalId = animalId || '00000000-0000-0000-0000-000000000000';
        const finalLogType = value.log_type || 'general';
        const finalDate = value.log_date || new Date().toISOString().slice(0, 16);
        const finalNotes = value.notes ? String(value.notes).trim() : 'NONE';
        const finalUnit = value.weight_unit || '-1';
        const num = (v: any) => (v === "" || v === undefined || v === null || isNaN(Number(v))) ? -1 : Number(v);
        const finalWeight = num(value.weight_grams);
        const finalBasking = num(value.basking_temp_c);
        const finalCool = num(value.cool_temp_c);
        const finalTemp = num(value.temperature_c);
        const finalFood = value.food ? String(value.food).trim() : 'N/A';
        const finalQuantity = num(value.quantity);
        const finalFeedTime = value.feed_time ? String(value.feed_time) : '00:00:00';
        const finalFeedMethod = value.feed_method ? String(value.feed_method).trim() : 'N/A';
        const finalCast = value.cast_status || 'N/A';
        const zeroUUID = '00000000-0000-0000-0000-000000000000';

        if (existingLogId) {
          await db.query(
            `UPDATE daily_logs SET log_type = $1, log_date = $2, notes = $3, weight_grams = $4, weight_unit = $5, basking_temp_c = $6, cool_temp_c = $7, temperature_c = $8, food = $9, quantity = $10, feed_time = $11, feed_method = $12, cast_status = $13, updated_at = now(), modified_by = $14 WHERE id = $15`,
            [finalLogType, finalDate, finalNotes, finalWeight, finalUnit, finalBasking, finalCool, finalTemp, finalFood, finalQuantity, finalFeedTime, finalFeedMethod, finalCast, zeroUUID, existingLogId]
          );
        } else {
          await db.query(
            `INSERT INTO daily_logs (animal_id, log_type, log_date, notes, weight_grams, weight_unit, basking_temp_c, cool_temp_c, temperature_c, food, quantity, feed_time, feed_method, cast_status, created_at, updated_at, created_by, modified_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now(), now(), $15, $15)`,
            [finalAnimalId, finalLogType, finalDate, finalNotes, finalWeight, finalUnit, finalBasking, finalCool, finalTemp, finalFood, finalQuantity, finalFeedTime, finalFeedMethod, finalCast, zeroUUID]
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
            {['feed'].includes(logType) && (
              <>
                  <form.Field name="food" children={(field) => (
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">Food</label>
                      <input name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                    </div>
                  )} />
                  <form.Field name="quantity" children={(field) => (
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">Quantity</label>
                      <input type="number" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => { const val = e.target.valueAsNumber; field.handleChange(isNaN(val) ? "" : val); }} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                    </div>
                  )} />
                  <form.Field name="feed_time" children={(field) => (
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">Time</label>
                      <input type="time" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                    </div>
                  )} />
                   <form.Field name="feed_method" children={(field) => (
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">Method</label>
                      <input name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-700" />
                    </div>
                  )} />
                  <form.Field name="cast_status" children={(field) => (
                    <div>
                      <label className="block text-sm mb-1 text-slate-400">Cast Status</label>
                      <select name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-700">
                        <option value="N/A">N/A</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )} />
                  </>
                )}
            {['misting', 'events', 'flight', 'water', 'training', 'general'].includes(logType) && (
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
