# Generated by Django 3.0.5 on 2021-01-25 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0031_groupsettings_uptime_schedule'),
    ]

    operations = [
        migrations.AddField(
            model_name='scan',
            name='force_https',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]