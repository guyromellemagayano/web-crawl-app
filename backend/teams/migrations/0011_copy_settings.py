# Generated by Django 3.2.6 on 2021-08-26 08:11

from django.db import migrations


def forwards_func(apps, schema_editor):
    Plan = apps.get_model("teams", "Plan")
    try:
        GroupSettings = apps.get_model("crawl", "GroupSettings")
    except LookupError:
        return
    for plan in Plan.objects.all():
        try:
            group_settings = plan.group.groupsettings
            plan.max_sites = group_settings.max_sites
            plan.recrawl_schedule = group_settings.recrawl_schedule
            plan.recrawl_frequency = group_settings.recrawl_frequency
            plan.uptime_schedule = group_settings.uptime_schedule
            plan.save()
        except GroupSettings.DoesNotExist:
            pass


class Migration(migrations.Migration):

    dependencies = [
        ("teams", "0010_auto_20210826_0810"),
    ]

    operations = [
        migrations.RunPython(forwards_func),
    ]