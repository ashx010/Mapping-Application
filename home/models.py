from django.db import models
import pandas as pd

# Create your models here.
class Country(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    capital = models.CharField(max_length=100)
    population = models.IntegerField()
    states = models.IntegerField()
    def __str__(self):
        return self.name
    
class State(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    population = models.IntegerField()
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    def __str__(self):
        return self.name + " - " + self.country.name
    
class branches(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    sales = models.IntegerField()
    date = models.DateField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    date_enter = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name + " - " + self.country.name + " - " + self.state.name

class AddBulkData(models.Model):
    id = models.AutoField(primary_key=True)
    Upload_To_Choices = [('Country', 'Country'), ('State', 'State'), ('Branch', 'Branch')]
    upload_to = models.CharField(max_length=10, choices=Upload_To_Choices)
    filename = models.FileField(upload_to='uploaded')
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Ensure to call the parent's save method

        if self.filename.name.endswith(('ods', 'xlsx')):
            data = pd.read_excel(self.filename.file)
        elif self.filename.name.endswith('csv'):
            data = pd.read_csv(self.filename.file)
        else:
            data = None
        
        if data is not None:
            for i in range(len(data)):
                if self.upload_to == 'Country':
                    country = Country(
                        name=data['Country'][i],
                        capital=data['Capital'][i],
                        population=data['Population'][i],
                        states=data['States'][i]
                    )
                    country.save()
                elif(self.upload_to == 'State'): 
                    country = Country.objects.get(name=data['Country'][i])
                    state = State(
                        name=data['State'][i],
                        population=data['Population'][i],
                        country=country
                    )
                    state.save()
                elif(self.upload_to == 'Branch'):
                    country = Country.objects.get(name=data['Country'][i])
                    state = State.objects.get(name=data['State'][i])
                    branch = branches(
                        name=data['Branch'][i],
                        country=country,
                        state=state,
                        sales=data['Sales'][i],
                        latitude=data['Latitude'][i],
                        longitude=data['Longitude'][i]
                    )
                    branch.save()