# Generated by Django 5.1.2 on 2024-12-08 16:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rec', '0005_alter_presenza_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='presenza',
            name='classe',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='presenze_classe', to='rec.classe'),
        ),
    ]
