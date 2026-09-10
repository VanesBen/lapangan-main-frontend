import { useState } from "react";
import axiosClient from "../../axios-client";
import toast from "react-hot-toast";

export default function PricingRuleCard({ 
    courtId = null, 
    pricingRules = [], 
    onRefresh = () => {}, 
    onChange = () => {} 
}) {
    const isLocalMode = !courtId; // Mode create tanpa API

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState(null);
    const [savingRule, setSavingRule] = useState(false);

    const [editRuleData, setEditRuleData] = useState({
        day_type: 'weekday',
        start_hour: 8,
        end_hour: 17,
        price_per_hour: 75000,
    });

    const [newRuleData, setNewRuleData] = useState({
        day_type: 'weekday',
        start_hour: 8,
        end_hour: 17,
        price_per_hour: 75000,
    });

    // Helper cek overlap
    const checkOverlap = (targetRule, excludeId = null) => {
        if (targetRule.start_hour >= targetRule.end_hour) {
            return "Jam selesai harus lebih besar dari jam mulai!";
        }
        const hasOverlap = pricingRules.some((rule) => {
            const ruleId = rule.id ?? rule._tempId;
            if (excludeId && ruleId === excludeId) return false;
            if (rule.day_type.toLowerCase() !== targetRule.day_type.toLowerCase()) return false;
            return targetRule.start_hour < rule.end_hour && targetRule.end_hour > rule.start_hour;
        });
        if (hasOverlap) {
            return `Rentang jam ${targetRule.start_hour}:00 - ${targetRule.end_hour}:00 bentrok dengan aturan ${targetRule.day_type}!`;
        }
        return null;
    };

    const handleStartEdit = (rule) => {
        setEditingRuleId(rule.id ?? rule._tempId);
        setEditRuleData({
            day_type: rule.day_type,
            start_hour: rule.start_hour,
            end_hour: rule.end_hour,
            price_per_hour: rule.price_per_hour,
        });
    };

    const handleSaveEdit = async (identifier) => {
        const overlapWarning = checkOverlap(editRuleData, identifier);
        if (overlapWarning) {
            toast.error(overlapWarning);
            return;
        }

        // Mode 1: Lokal (Create Court)
        if (isLocalMode) {
            const updated = pricingRules.map((r) => 
                (r.id ?? r._tempId) === identifier ? { ...r, ...editRuleData } : r
            );
            onChange(updated);
            setEditingRuleId(null);
            toast.success("Aturan tarif diperbarui.");
            return;
        }

        // Mode 2: API (Edit Court)
        setSavingRule(true);
        try {
            await axiosClient.patch(`/prices/${identifier}`, editRuleData);
            setEditingRuleId(null);
            onRefresh();
            toast.success("Aturan tarif berhasil di-update!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Gagal mengubah aturan tarif.');
        } finally {
            setSavingRule(false);
        }
    };

    const handleDeleteRule = async (identifier) => {
        if (!confirm('Yakin ingin menghapus slot aturan tarif ini?')) return;

        // Mode 1: Lokal (Create Court)
        if (isLocalMode) {
            const updated = pricingRules.filter((r) => (r.id ?? r._tempId) !== identifier);
            onChange(updated);
            toast.success("Aturan tarif dihapus.");
            return;
        }

        // Mode 2: API (Edit Court)
        try {
            await axiosClient.delete(`/prices/${identifier}`);
            onRefresh();
            toast.success("Aturan tarif berhasil dihapus.");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Gagal menghapus aturan tarif.');
        }
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();

        const overlapWarning = checkOverlap(newRuleData);
        if (overlapWarning) {
            toast.error(overlapWarning);
            return;
        }

        // Mode 1: Lokal (Create Court)
        if (isLocalMode) {
            const newItem = {
                _tempId: Date.now(), // Unique identifier lokal
                ...newRuleData,
            };
            onChange([...pricingRules, newItem]);
            setShowAddForm(false);
            toast.success("Slot tarif ditambahkan ke daftar.");
            return;
        }

        // Mode 2: API (Edit Court)
        setSavingRule(true);
        try {
            await axiosClient.post('/prices', {
                courts_id: courtId,
                ...newRuleData,
            });
            setShowAddForm(false);
            onRefresh();
            toast.success("Aturan tarif baru tersimpan!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Gagal menambahkan aturan tarif.');
        } finally {
            setSavingRule(false);
        }
    };

    return (
        <div id="pricing-rules-section" className="bg-[#1e1e1e] border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6 scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                    <h2 className="text-lg font-bold text-white">Aturan Jam & Tarif Sewa</h2>
                    <p className="text-xs text-neutral-400 mt-1">
                        Atur harga per jam berdasarkan tipe hari dan rentang operasional lapangan.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <span>{showAddForm ? '✕ Batal' : '+ Tambah Slot Tarif'}</span>
                </button>
            </div>

            {/* Form Tambah Slot Baru */}
            {showAddForm && (
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase text-neutral-400">Tambah Aturan Baru</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Input dropdown dan fields tetap sama */}
                <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">Tipe Hari</label>
                    <select
                    value={newRuleData.day_type}
                    onChange={(e) => setNewRuleData({ ...newRuleData, day_type: e.target.value })}
                    className="w-full bg-[#13161b] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                    <option value="weekday">Weekday</option>
                    <option value="weekend">Weekend</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">Jam Mulai</label>
                    <input
                    type="number"
                    min="0"
                    max="23"
                    value={newRuleData.start_hour}
                    onChange={(e) => setNewRuleData({ ...newRuleData, start_hour: Number(e.target.value) })}
                    className="w-full bg-[#13161b] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">Jam Selesai</label>
                    <input
                    type="number"
                    min="1"
                    max="24"
                    value={newRuleData.end_hour}
                    onChange={(e) => setNewRuleData({ ...newRuleData, end_hour: Number(e.target.value) })}
                    className="w-full bg-[#13161b] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                    />
                </div>

                <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">Tarif / Jam (Rp)</label>
                    <input
                    type="number"
                    step="5000"
                    value={newRuleData.price_per_hour}
                    onChange={(e) => setNewRuleData({ ...newRuleData, price_per_hour: Number(e.target.value) })}
                    className="w-full bg-[#13161b] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                    />
                </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-800"
                >
                    Tutup
                </button>

                
                <button
                    type="button"
                    disabled={savingRule}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleCreateRule(e)
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold disabled:opacity-50"
                >
                    {savingRule ? 'Menyimpan...' : 'Simpan Slot'}
                </button>
                </div>
            </div>
            )}

            {/* Tabel Data */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-300">
                    <thead className="bg-neutral-900 text-xs uppercase font-semibold text-neutral-400">
                        <tr>
                            <th className="px-4 py-3 rounded-l-xl">Tipe Hari</th>
                            <th className="px-4 py-3">Jam Operasional</th>
                            <th className="px-4 py-3">Tarif / Jam</th>
                            <th className="px-4 py-3 text-right rounded-r-xl">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {pricingRules.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-4 py-8 text-center text-xs text-neutral-500">
                                    Belum ada aturan jam dan tarif yang dibuat untuk lapangan ini.
                                </td>
                            </tr>
                        ) : (
                            pricingRules.map((rule) => {
                                const keyId = rule.id ?? rule._tempId;
                                const isEditing = editingRuleId === keyId;

                                if (isEditing) {
                                    return (
                                        <tr key={keyId} className="bg-neutral-900/90">
                                            <td className="px-4 py-3">
                                                <select
                                                    value={editRuleData.day_type}
                                                    onChange={(e) => setEditRuleData({ ...editRuleData, day_type: e.target.value })}
                                                    className="bg-[#13161b] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-lime-400 focus:outline-none"
                                                >
                                                    <option value="weekday">Weekday</option>
                                                    <option value="weekend">Weekend</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        value={editRuleData.start_hour}
                                                        onChange={(e) => setEditRuleData({ ...editRuleData, start_hour: Number(e.target.value) })}
                                                        className="w-14 bg-[#13161b] border border-neutral-700 rounded-lg px-2 py-1 text-center text-white focus:border-lime-400 focus:outline-none"
                                                    />
                                                    <span className="text-neutral-500">-</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="24"
                                                        value={editRuleData.end_hour}
                                                        onChange={(e) => setEditRuleData({ ...editRuleData, end_hour: Number(e.target.value) })}
                                                        className="w-14 bg-[#13161b] border border-neutral-700 rounded-lg px-2 py-1 text-center text-white focus:border-lime-400 focus:outline-none"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <span className="text-neutral-500">Rp</span>
                                                    <input
                                                        type="number"
                                                        step="5000"
                                                        value={editRuleData.price_per_hour}
                                                        onChange={(e) => setEditRuleData({ ...editRuleData, price_per_hour: Number(e.target.value) })}
                                                        className="w-28 bg-[#13161b] border border-neutral-700 rounded-lg px-2 py-1 text-white focus:border-lime-400 focus:outline-none"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button
                                                    type="button"
                                                    disabled={savingRule}
                                                    onClick={() => handleSaveEdit(keyId)}
                                                    className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-md transition-colors disabled:opacity-50"
                                                >
                                                    {savingRule ? '...' : 'Simpan'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingRuleId(null)}
                                                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-md transition-colors"
                                                >
                                                    Batal
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }

                                const isWeekend = rule.day_type === 'weekend';

                                return (
                                    <tr key={keyId} className="hover:bg-neutral-900/40 transition-colors">
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border ${
                                                    isWeekend
                                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}
                                            >
                                                {rule.day_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-white">
                                            {String(rule.start_hour).padStart(2, '0')}:00 - {String(rule.end_hour).padStart(2, '0')}:00
                                        </td>
                                        <td className="px-4 py-3.5 text-emerald-400 font-bold">
                                            Rp {Number(rule.price_per_hour).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3.5 text-right space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => handleStartEdit(rule)}
                                                className="text-xs text-neutral-400 hover:text-white transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRule(keyId)}
                                                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}