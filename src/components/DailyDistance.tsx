import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface IRecord {
  id: string;
  date: string;
  distance: number;
}

export const DailyDistance = () => {
  const [records, setRecords] = useState<IRecord[]>([]);

  const [form, setForm] = useState({
    id: "",
    date: "",
    distance: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(form.distance)) {
      updateSteps();
      setForm({
        id: "",
        date: "",
        distance: "",
      });
    }

    return;
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
      date: record.date,
      distance: record.distance.toString(),
    });

    handleDelete(record.id);
  };

  const updateSteps = () => {
    const { date, distance } = form;

    for (const record of records) {
      if (record.date === date) {
        record.distance += Number(distance);

        return;
      }
    }

    setRecords((prev) => [
      ...prev,
      {
        id: uuidv4(),
        date: date,
        distance: Number(distance),
      },
    ]);
  };

  return (
    <div className="daily-distance">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">DATE (DD.MM.YY)</label>
          <input
            type="text"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="distance">DISTANCE</label>
          <input
            type="text"
            name="distance"
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
              <th>DATE (DD.MM.YY)</th>
              <th>DISTANCE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr>
                <td>{record.date}</td>
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
