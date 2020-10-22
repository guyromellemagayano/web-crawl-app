package database

import (
	"github.com/go-pg/pg"
)

type LinkScriptDao struct {
	DB *pg.DB
}

func (s *LinkScriptDao) ByID(id int) (*CrawlLinkScript, error) {
	link_script := &CrawlLinkScript{ID: id}
	if err := s.DB.Select(link_script); err != nil {
		return nil, err
	}
	return link_script, nil
}

func (s *LinkScriptDao) Save(link_script *CrawlLinkScript) error {
	if link_script.ID == 0 {
		return s.DB.Insert(link_script)
	}
	return s.DB.Update(link_script)
}

func (s *LinkScriptDao) DeleteAllForScan(scanID int) error {
	subquery := s.DB.Model(&CrawlLink{}).Column("id").Where("scan_id = ?", scanID)
	_, err := s.DB.Model(&CrawlLinkScript{}).Where("from_link_id IN (?)", subquery).Delete()
	return err
}

func (s *LinkScriptDao) AllForLinkForEach(linkID int, f func(*CrawlLinkScript) error) error {
	pageSize := 10
	results := make([]*CrawlLinkScript, 0, pageSize)
	for page := 0; true; page++ {
		err := s.DB.Model(&results).Where("from_link_id = ?", linkID).Order("id ASC").Limit(pageSize).Offset(page * pageSize).Select(&results)
		if err != nil {
			return err
		}

		for _, el := range results {
			if err := f(el); err != nil {
				return err
			}
		}

		if len(results) < pageSize {
			break
		}

		results = results[:0]
	}
	return nil
}