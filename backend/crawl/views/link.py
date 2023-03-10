from django_filters import rest_framework as filters
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from common import HasPermission
from crawl.common import CsvMixin
from crawl.models import Link
from crawl.serializers import (
    LinkSerializer,
    ImageSerializer,
    LinkDetailSerializer,
    ImageDetailSerializer,
    ScriptDetailSerializer,
    StylesheetDetailSerializer,
)
from teams.service import get_current_membership, get_current_team, has_permission


class HumanReadableMultipleChoiceFilter(filters.MultipleChoiceFilter):
    def __init__(self, *args, **kwargs):
        if "choices" in kwargs:
            self.choices_map = {x[1]: x[0] for x in kwargs["choices"]}
            kwargs["choices"] = [(x[1], x[1]) for x in kwargs["choices"]]
        return super().__init__(*args, **kwargs)

    def filter(self, qs, values):
        return super().filter(qs, [self.choices_map.get(value, value) for value in values])


class LinkFilter(filters.FilterSet):
    type = HumanReadableMultipleChoiceFilter(choices=Link.TYPE_CHOICES)
    type__neq = HumanReadableMultipleChoiceFilter(field_name="type", choices=Link.TYPE_CHOICES, exclude=True)
    status = HumanReadableMultipleChoiceFilter(
        field_name="status_adjusted", choices=Link.STATUS_CHOICES, label="Status"
    )
    status__neq = HumanReadableMultipleChoiceFilter(
        field_name="status_adjusted", choices=Link.STATUS_CHOICES, exclude=True, label="Exclude status"
    )
    tls_status = HumanReadableMultipleChoiceFilter(
        field_name="tls_status_adjusted", choices=Link.TLS_STATUS_CHOICES, label="TLS status"
    )
    tls_status__neq = HumanReadableMultipleChoiceFilter(
        field_name="tls_status_adjusted", choices=Link.TLS_STATUS_CHOICES, exclude=True, label="Exclude TLS status"
    )
    http_status__neq = filters.NumberFilter(field_name="http_status", exclude=True)

    class Meta:
        model = Link
        fields = {
            "created_at": ["gt", "gte", "lt", "lte"],
            "http_status": ["exact", "gt", "gte", "lt", "lte", "in"],
            "response_time": ["gt", "gte", "lt", "lte"],
            "size": ["gt", "gte", "lt", "lte"],
            "error": ["exact", "icontains"],
        }


class PageChildViewSet(
    CsvMixin,
    DetailSerializerMixin,
    NestedViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer

    filterset_class = LinkFilter
    search_fields = ["url"]
    ordering_fields = [
        "id",
        "created_at",
        "type",
        "url",
        "status",
        "http_status",
        "response_time",
        "error",
        "size",
        "occurences",
        "tls_status",
    ]

    def get_queryset(self):
        queryset = super().get_queryset().filter(scan__site__deleted_at__isnull=True).annotate_link_adjusted()
        if self.request.user.is_superuser:
            pass
        elif has_permission(self.request, "crawl.can_see_all_sites"):
            queryset = queryset.filter(scan__site__team=get_current_team(self.request))
        else:
            queryset = queryset.filter(scan__site__membership=get_current_membership(self.request))
        return queryset


class LinkViewSet(PageChildViewSet):
    serializer_detail_class = LinkDetailSerializer

    def get_queryset(self):
        return super().get_queryset().links()


class ImageFilter(LinkFilter):
    # custom filters because field name doesn't match filter name
    missing_alts__gt = filters.NumberFilter(
        field_name="missing_alts_adjusted",
        label="Missing alts is greater than",
        lookup_expr="gt",
    )
    missing_alts__gte = filters.NumberFilter(
        field_name="missing_alts_adjusted",
        label="Missing alts is greater than or equal to",
        lookup_expr="gte",
    )
    missing_alts__lt = filters.NumberFilter(
        field_name="missing_alts_adjusted",
        label="Missing alts is less than (doesn't work for 0)",
        lookup_expr="lt",
    )
    missing_alts__lte = filters.NumberFilter(
        field_name="missing_alts_adjusted",
        label="Missing alts is less than or equal to (doesn't work for 0)",
        lookup_expr="lte",
    )

    class Meta(LinkFilter.Meta):
        pass


class ImageViewSet(PageChildViewSet):
    permission_classes = [HasPermission("crawl.can_see_images")]
    serializer_class = ImageSerializer
    serializer_detail_class = ImageDetailSerializer

    filterset_class = ImageFilter
    ordering_fields = PageChildViewSet.ordering_fields + [
        "missing_alts",
    ]

    def get_queryset(self):
        return super().get_queryset().images().annotate_image_adjusted()


class ScriptViewSet(PageChildViewSet):
    permission_classes = [HasPermission("crawl.can_see_scripts")]
    serializer_detail_class = ScriptDetailSerializer

    def get_queryset(self):
        return super().get_queryset().scripts()


class StylesheetViewSet(PageChildViewSet):
    permission_classes = [HasPermission("crawl.can_see_stylesheets")]
    serializer_detail_class = StylesheetDetailSerializer

    def get_queryset(self):
        return super().get_queryset().stylesheets()
