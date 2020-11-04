package database

import (
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
)

type DB interface {
	Model(...interface{}) *orm.Query
	Begin() (*pg.Tx, error)
	Close() error
}

type Database struct {
	LinkDao GenericDao
	ScanDao GenericDao
	db      DB
}

func NewDatabase(db DB) *Database {
	return &Database{
		LinkDao: GenericDao{model: &CrawlLink{}, db: db},
		ScanDao: GenericDao{model: &CrawlScan{}, db: db},
		db:      db,
	}
}

func (d Database) Insert(m interface{}, options ...QueryOption) error {
	q := d.db.Model(m)
	for _, o := range options {
		q = o(q)
	}
	_, err := q.Insert()
	return err
}

func (d Database) ByID(m interface{}, options ...QueryOption) error {
	q := d.db.Model(m).WherePK()
	for _, o := range options {
		q = o(q)
	}
	return q.Select()
}

func (d Database) Get(m interface{}, options ...QueryOption) error {
	options = append([]QueryOption{Limit(1)}, options...)
	return d.All(m, options...)
}

func (d Database) All(m interface{}, options ...QueryOption) error {
	q := d.db.Model(m)
	for _, o := range options {
		q = o(q)
	}
	return q.Select()
}

func (d Database) Update(m interface{}) error {
	_, err := d.db.Model(m).WherePK().Update()
	return err
}

func (d Database) Close() error {
	return d.db.Close()
}

func (d Database) RunInTransaction(f func(*Database) error) error {
	tx, err := d.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Close()

	if err := f(NewDatabase(tx)); err != nil {
		if err := tx.Rollback(); err != nil {
			return err
		}
		return err
	}

	return tx.Commit()
}
