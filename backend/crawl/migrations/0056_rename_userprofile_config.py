# Generated by Django 3.2.6 on 2021-08-18 10:13

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('teams', '0005_auto_20210812_1538'),
        ('crawl', '0055_alter_userprofile_user'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserProfile',
            new_name='Config',
        ),
    ]
