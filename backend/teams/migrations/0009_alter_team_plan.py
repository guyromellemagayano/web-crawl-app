# Generated by Django 3.2.6 on 2021-08-26 07:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0008_assign_plan_to_team'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='plan',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='teams.plan'),
        ),
    ]
