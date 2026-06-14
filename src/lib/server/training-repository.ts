import { ensureDatabaseReady, getDbPool } from '@/lib/server/db';
import { ClassSession, UserTraining } from '@/lib/training-types';

type ClassSessionRow = {
  id: number;
  title: string;
  day_of_week: string;
  start_time: string;
  capacity: number;
  trainer_id: number;
  trainer_name: string;
  specialty: string;
};

type UserTrainingRow = {
  id: number;
  date: Date | string;
  class_session_id: number;
  title: string;
  day_of_week: string;
  start_time: string;
  capacity: number;
  trainer_name: string;
  specialty: string;
};

const seedTrainers = [
  ['Олена Венс', 'Power Yoga', '8 років'],
  ['Маркус Торн', 'HIIT Circuit', '10 років'],
  ['Девід Бек', 'Spin Mastery', '6 років'],
  ['Сара Дж.', 'Body Pump', '7 років'],
  ['Тайсон Р.', 'Boxing Basics', '12 років'],
] as const;

const seedClasses = [
  [1, 'Power Yoga', 'Monday', '07:00:00', 20],
  [2, 'HIIT Circuit', 'Monday', '09:00:00', 18],
  [3, 'Spin Mastery', 'Monday', '11:00:00', 16],
  [4, 'Body Pump', 'Monday', '16:00:00', 22],
  [5, 'Boxing Basics', 'Monday', '18:00:00', 14],
] as const;

let trainingTablesReady: Promise<void> | null = null;

function serializeDate(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function normalizeTime(value: string) {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function mapClassSession(row: ClassSessionRow): ClassSession {
  return {
    id: Number(row.id),
    title: row.title,
    day_of_week: row.day_of_week,
    start_time: normalizeTime(row.start_time),
    capacity: Number(row.capacity),
    trainer_id: Number(row.trainer_id),
    trainer_name: row.trainer_name,
    specialty: row.specialty,
  };
}

function mapUserTraining(row: UserTrainingRow): UserTraining {
  return {
    id: Number(row.id),
    date: serializeDate(row.date),
    class_session_id: Number(row.class_session_id),
    title: row.title,
    day_of_week: row.day_of_week,
    start_time: normalizeTime(row.start_time),
    capacity: Number(row.capacity),
    trainer_name: row.trainer_name,
    specialty: row.specialty,
  };
}

export async function ensureTrainingTables() {
  if (!trainingTablesReady) {
    trainingTablesReady = (async () => {
      await ensureDatabaseReady();
      const pool = getDbPool();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS trainers (
          id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          full_name VARCHAR(150) NOT NULL,
          specialty VARCHAR(150) NOT NULL,
          experience VARCHAR(100),
          photo_url VARCHAR(500),
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS class_sessions (
          id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
          title VARCHAR(150) NOT NULL,
          day_of_week VARCHAR(20) NOT NULL,
          start_time TIME NOT NULL,
          capacity INTEGER NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT chk_class_sessions_capacity CHECK (capacity > 0)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_training (
          id SERIAL PRIMARY KEY,
          user_ids INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
          class_session_ids INTEGER NOT NULL REFERENCES class_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE,
          date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_training_user_ids ON user_training (user_ids)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_training_class_session_ids ON user_training (class_session_ids)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_training_date ON user_training (date)`);

      for (const [fullName, specialty, experience] of seedTrainers) {
        await pool.query(
          `INSERT INTO trainers (full_name, specialty, experience)
           SELECT $1::varchar, $2::varchar, $3::varchar
           WHERE NOT EXISTS (
             SELECT 1 FROM trainers WHERE full_name = $1::varchar AND specialty = $2::varchar
           )`,
          [fullName, specialty, experience]
        );
      }

      for (const [trainerId, title, dayOfWeek, startTime, capacity] of seedClasses) {
        await pool.query(
          `INSERT INTO class_sessions (trainer_id, title, day_of_week, start_time, capacity)
           SELECT $1::integer, $2::varchar, $3::varchar, $4::time, $5::integer
           WHERE NOT EXISTS (
             SELECT 1
             FROM class_sessions
             WHERE title = $2::varchar AND day_of_week = $3::varchar AND start_time = $4::time
           )`,
          [trainerId, title, dayOfWeek, startTime, capacity]
        );
      }
    })().catch((error) => {
      trainingTablesReady = null;
      throw error;
    });
  }

  return trainingTablesReady;
}

export async function listClassSessions(dayOfWeek?: string) {
  await ensureTrainingTables();
  const pool = getDbPool();
  const params = dayOfWeek ? [dayOfWeek] : [];
  const where = dayOfWeek ? 'WHERE cs.day_of_week = $1' : '';

  const result = await pool.query<ClassSessionRow>(
    `SELECT cs.id,
            cs.title,
            cs.day_of_week,
            cs.start_time::text AS start_time,
            cs.capacity,
            cs.trainer_id,
            t.full_name AS trainer_name,
            t.specialty
     FROM class_sessions cs
     JOIN trainers t ON t.id = cs.trainer_id
     ${where}
     ORDER BY cs.start_time ASC`,
    params
  );

  return result.rows.map(mapClassSession);
}

export async function createUserTraining(userId: number, classSessionId: number) {
  await ensureTrainingTables();
  const pool = getDbPool();
  const result = await pool.query<UserTrainingRow>(
    `INSERT INTO user_training (user_ids, class_session_ids)
     VALUES ($1, $2)
     RETURNING id,
               date,
               class_session_ids AS class_session_id,
               (SELECT title FROM class_sessions WHERE id = $2) AS title,
               (SELECT day_of_week FROM class_sessions WHERE id = $2) AS day_of_week,
               (SELECT start_time::text FROM class_sessions WHERE id = $2) AS start_time,
               (SELECT capacity FROM class_sessions WHERE id = $2) AS capacity,
               (SELECT t.full_name
                FROM class_sessions cs
                JOIN trainers t ON t.id = cs.trainer_id
                WHERE cs.id = $2) AS trainer_name,
               (SELECT t.specialty
                FROM class_sessions cs
                JOIN trainers t ON t.id = cs.trainer_id
                WHERE cs.id = $2) AS specialty`,
    [userId, classSessionId]
  );

  return mapUserTraining(result.rows[0]);
}

export async function listUserTrainings(userId: number) {
  await ensureTrainingTables();
  const pool = getDbPool();
  const result = await pool.query<UserTrainingRow>(
    `SELECT ut.id,
            ut.date,
            ut.class_session_ids AS class_session_id,
            cs.title,
            cs.day_of_week,
            cs.start_time::text AS start_time,
            cs.capacity,
            t.full_name AS trainer_name,
            t.specialty
     FROM user_training ut
     JOIN class_sessions cs ON cs.id = ut.class_session_ids
     JOIN trainers t ON t.id = cs.trainer_id
     WHERE ut.user_ids = $1
     ORDER BY ut.date DESC`,
    [userId]
  );

  return result.rows.map(mapUserTraining);
}
