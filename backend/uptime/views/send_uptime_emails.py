from django.conf import settings
from django.contrib.sites import models
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response

from uptime.models import UptimeStat
from teams.service import has_permission


class IsSuperuser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser


class SendUptimeEmailsView(APIView):
    permission_classes = [IsSuperuser]

    def post(self, request, format=None):
        site = models.Site.objects.get_current()
        uptime_stats = (
            UptimeStat.objects.select_related("site__team")
            .filter(site__deleted_at__isnull=True)
            .filter(id__in=request.data)
        )
        for stat in uptime_stats:
            for membership in stat.site.team.membership_set.all():
                if not has_permission(request, "uptime.can_get_uptime_emails", membership=membership):
                    continue

                context = {
                    "user": membership.user,
                    "site": site,
                    "crawl_site": stat.site,
                    "stat": stat,
                    "status": "UP" if stat.status == UptimeStat.STATUS_OK else "DOWN",
                }
                subject = render_to_string("uptime_email_subject.txt", context).strip()
                message = render_to_string("uptime_email_message.txt", context)
                send_mail(
                    settings.EMAIL_SUBJECT_PREFIX + subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [membership.user.email],
                )

        return Response()
