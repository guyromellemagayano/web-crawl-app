# Generated by Django 3.2.6 on 2021-09-10 10:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0059_delete_groupsettings'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='site',
            name='user',
        ),
    ]