import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import type { IFormData } from "../types/types";
import type { IRecord } from "../types/types";

export const DailyDistance = () => {
  const [records, setRecords] = useState<IRecord[]>([]);

  const [form, setForm] = useState<IFormData>({
    id: "",
    date: "",
    distance: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.date || !form.distance) return;

    const validForm = {
      id: form.id || uuidv4(),
      date: new Date(form.date),
      distance: parseFloat(form.distance),
    };

    updateRecords(validForm)

    setForm({
      id: "",
      date: "",
      distance: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    e.preventDefault();

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const handleEdit = (record: IRecord) => {
    setForm({
      id: record.id,
      date: record.date.toISOString().split('T')[0],
      distance: record.distance.toString(),
    });

    handleDelete(record.id);
  };

  const updateRecords = (newRecord: IRecord) => {
    setRecords((prev) => {
      const existIndex = prev.findIndex(
        (record) =>
          record.date.toDateString() === newRecord.date.toDateString(),
      );

      const updatedRecord = [...prev]
      
      if (existIndex >= 0) {
        updatedRecord[existIndex] = {
          ...updatedRecord[existIndex],
          distance: updatedRecord[existIndex].distance + newRecord.distance
        }

        return updatedRecord;
      }

      return [...prev, newRecord].sort((a, b) => b.date.getTime() - a.date.getTime());
    });
  };

  return (
    <div className="daily-distance">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">DATE</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="distance">DISTANCE</label>
          <input
            type="number"
            name="distance"
            step={0.1}
            value={form.distance}
            onChange={handleChange}
          />
        </div>
        <button className="btn submit-btn">OK</button>
      </form>
      <div className="table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>DISTANCE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr>
                <td>{record.date.toLocaleDateString()}</td>
                <td>{record.distance}</td>
                <td>
                  <a
                    className="btn delete-btn"
                    onClick={() => handleDelete(record.id)}
                  >
                    ✘
                  </a>
                  <a
                    className="btn edit-btn"
                    onClick={() => handleEdit(record)}
                  >
                    ✎
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
