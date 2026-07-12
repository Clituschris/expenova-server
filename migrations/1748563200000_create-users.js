export async function up(pgm) {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    name: {
      type: 'varchar(255)',
      notNull: true
    },
    phone: {
      type: 'varchar(15)',
      notNull: true
    },
    password_hash: {
      type: 'varchar(255)',
      notNull: true
    },
    is_active: {
      type: 'boolean',
      notNull: true,
      default: true
    },
    last_login: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()')
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()')
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()')
    }
  });

  pgm.createIndex('users', 'email');

  pgm.createFunction(
    'set_updated_at',
    [],
    { returns: 'trigger', language: 'plpgsql', replace: true },
    `BEGIN NEW.updated_at = now(); RETURN NEW; END;`
  );

  pgm.createTrigger('users', 'users_set_updated_at', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: 'set_updated_at'
  });
}

export async function down(pgm) {
  pgm.dropTrigger('users', 'users_set_updated_at');
  pgm.dropFunction('set_updated_at', []);
  pgm.dropTable('users');
}
