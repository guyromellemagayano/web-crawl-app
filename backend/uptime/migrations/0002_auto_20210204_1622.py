# Generated by Django 3.0.5 on 2021-02-04 16:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('uptime', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='uptimestat',
            options={'permissions': (('can_get_uptime_emails', 'Can get uptime emails'),)},
        ),
    ]