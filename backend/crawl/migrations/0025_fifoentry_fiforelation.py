# Generated by Django 3.0.5 on 2020-11-05 12:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('crawl', '0024_auto_20201028_1548'),
    ]

    operations = [
        migrations.CreateModel(
            name='FifoEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.TextField()),
                ('depth', models.PositiveIntegerField()),
                ('scan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='crawl.Scan')),
            ],
        ),
        migrations.CreateModel(
            name='FifoRelation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parent_id', models.PositiveIntegerField()),
                ('child_type', models.PositiveSmallIntegerField()),
                ('entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='crawl.FifoEntry')),
            ],
        ),
    ]