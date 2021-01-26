package common

import (
	"strings"

	"go.uber.org/zap"
)

func LenLimit(s string, limit int) string {
	if len(s) > limit {
		return s[:limit]
	}
	return s
}

func SerializeLoadError(log *zap.SugaredLogger, url string, err error) (int, string) {
	status := STATUS_OTHER_ERROR
	if strings.HasSuffix(err.Error(), "context deadline exceeded") {
		status = STATUS_TIMEOUT
	} else if strings.HasSuffix(err.Error(), "stopped after 10 redirects") {
		status = STATUS_TOO_MANY_REDIRECTS
	} else if strings.HasSuffix(err.Error(), "INTERNAL_ERROR") && strings.HasPrefix(err.Error(), "stream error:") {
		return STATUS_OTHER_ERROR, "http2 internal error"
	} else {
		if !strings.HasSuffix(err.Error(), "unexpected EOF") &&
			!strings.HasSuffix(err.Error(), "server replied with more than declared Content-Length; truncated") &&
			!strings.HasSuffix(err.Error(), "connection reset by peer") {
			log.Errorw("Other error for link",
				"url", url,
				"error", err,
			)
		}
	}
	return status, LenLimit(err.Error(), 255)
}
