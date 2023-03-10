package common

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/go-pg/pg/v9"
	"go.uber.org/zap"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
)

func ConfigureDatabase(log *zap.SugaredLogger, awsSession *session.Session, user, env string) *database.Database {
	dbPass := Secret(log, awsSession, env, "DB_PASS_"+strings.ToUpper(user), "")
	if dbPass == "" {
		dbPass = Secret(log, awsSession, env, "DB_PASS", "crawldev")
	}
	var pgOptions *pg.Options
	if env == "production" {
		pgOptions = &pg.Options{
			Addr:     "terraform-20200810173347645600000001.ceavi2ewfiqg.us-east-1.rds.amazonaws.com:5432",
			User:     user,
			Password: dbPass,
			Database: "production",
		}
	} else {
		pgOptions = &pg.Options{
			Addr:     "db:5432",
			User:     "postgres",
			Password: dbPass,
			Database: "postgres",
		}
	}
	db := pg.Connect(pgOptions)
	if Env("LOG_SQL", "false") == "true" {
		db.AddQueryHook(database.DbLogger{log})
	}
	for {
		if _, err := db.Exec("SELECT 1"); err != nil {
			log.Infof("Waiting for db: %v", err)
			time.Sleep(time.Second)
			continue
		}
		break
	}
	return database.NewDatabase(db)
}
