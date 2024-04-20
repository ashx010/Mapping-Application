from django.contrib import admin
from home.models import Country, State, AddBulkData, branches

class countryadmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'capital', 'population', 'states']
    search_fields = ['name', 'capital']
    list_filter = ['name']

class stateadmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'population', 'country']
    search_fields = ['name']
    list_filter = ['name', 'country']
    
class branchesadmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'country', 'state', 'sales', 'date', 'latitude', 'longitude', 'date_enter']
    search_fields = ['name']
    list_filter = ['name', 'country', 'state', 'date', 'date_enter']

class addbulkadmin(admin.ModelAdmin):
    list_display = ['id', 'upload_to', 'filename', 'updated_at']
    search_fields = ['filename']

# Register your models here.
admin.site.register(Country, countryadmin)
admin.site.register(State, stateadmin)
admin.site.register(AddBulkData, addbulkadmin)
admin.site.register(branches, branchesadmin)
