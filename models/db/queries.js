const jobsWhiteList = "ready"
const tenantsWhiteList = ""
const chargesWhiteList = ""
module.exports = {
  jobs: {
    create:
      `WITH ins1 AS (
        INSERT INTO jobs (${jobsWhiteList})
          SELECT *
            FROM
              json_populate_record(null::jobs-'id', $1)
        -- ON   CONFLICT DO NOTHING  -- optional addition in Postgres 9.5+
        RETURNING id AS job_id
      ),
      ins2 AS (
        INSERT INTO stops (job_id, ${stopsWhiteList})
          SELECT * FROM $1->stops
      )
      INSERT INTO charges (job_id, ${chargesWhiteList})   -- same here
        SELECT * FROM $1->charges`,
    read: 
      `SELECT row_to_json(row) FROM (
        SELECT ($(jobsWhiteList) from jobs where id=$1 )
      ) row`

      `SELECT row_to_json(job) FROM (
          SELECT ${jobsWhiteList},
            (
              SELECT array_to_json(array_agg(row_to_json(stop)))
              FROM (
                SELECT * FROM stops WHERE job_id=jobs.id
                order by position asc
              ) stop
            ) as stops ,
            (
              SELECT array_to_json(array_agg(row_to_json(charges)))
              FROM (
                SELECT * FROM charges WHERE job_id=jobs.id
              ) charge
            ) as charges
          FROM jobs
          WHERE id = $1
        ) job`,
    list: undefined
  },
  charges: {
    create:
      `INSERT INTO charges (${chargesWhiteList})
        SELECT *
          FROM 
            json_populate_record(null::charges-'id', $1)`,
    update: undefined,
    delete: undefined
  },
  stops: {
    update:
      `WITH the_stops AS
        SELECT * 
          FROM 
            json_populate_recordset(null::stops-'id', $1) 
      UPDATE stops 
        SET 
          stops.at = the_stops.at 
        WHERE 
          stops.id = the_stops.id`
  },
  tenants: {
    list: 
        `SELECT * FROM tenants`,

    create:
      `INSERT INTO tenants (${tenantsWhiteList})
        SELECT *
          FROM
            json_populate_record(null::tenants-'id', $1)`,

    update:
      `UPDATE tenants  
        SELECT ${tenantsWhiteList}
          FROM
            json_populate_record(null::tenants-'id', $1)`
  },
  statements: {
    list:
        `select array_to_json(array_agg(row_to_json(t)))
          from (
            select * from statements
          ) t`,

    read: 
       `select row_to_json(t)
          from (
            select * from statements where id=$1
          ) t`
  },
  payments: {
    list:
      `SELECT * FROM payments`, // <== Wrong

    create: `WITH 
    ins1 AS (
      INSERT INTO payments 
        SELECT (${paymentsWhiteList})
          FROM
            json_populate_record(null::payments-'id', $1)
      -- ON   CONFLICT DO NOTHING  -- optional addition in Postgres 9.5+
      RETURNING id AS payment_id
    ),
    INSERT INTO allocations
        SELECT ins1.payment_id, ${allocationWhiteList}  
          FROM 
            json_populate_recordset(null::allocations-'id', $1->allocations)`
    `
  }
}
   
invoice:
   `insert into statements
   select company.id, date_due, total 
   from 
   jobs where job.state = completed 
   charges,
   stops`


   select row_to_json(t)
from (
  select text, pronunciation, // jobs fields
    (
      select array_to_json(array_agg(row_to_json(c)))
      from (
        select quantify, description, charge
        from charges
        where job_id=jobs.id
      ) c
    ) as charges,
    select array_to_json(array_agg(row_to_json(s)))
    from (
      select address, description, charge
      from stops
      where job_id=jobs.id
    ) s
  ) as stops, 
  from jobs
  where text = 'autumn'
) t