from django.shortcuts import render, redirect
from home.models import Country, State, branches
from django.http import JsonResponse
from django.db.models import Q
from datetime import datetime


# Create your views here.
def index(request):
    return render(request, 'index.html')

def getdata(request):
    context = {}
    data_country = Country.objects.all().values()
    data_state = State.objects.all().values().order_by('country')
    context['country'] = list(data_country)
    context['state'] = list(data_state)

    return JsonResponse(context, safe=False) 

def getbranchdata(request):
    context = {}
    country = request.GET.get('country')
    state = request.GET.get('state')
    month = request.GET.get('month')
    year = request.GET.get('year')

    # Construct the start and end date for the given month and year
    start_date = datetime(int(year), int(month), 1)
    end_date = start_date.replace(month=int(month) % 12 + 1, year=int(year) if int(month) != 12 else int(year) + 1, day=1)

    # Filter data by country, state, and date range
    data = branches.objects.filter(
        Q(country=country) & 
        Q(state=state) & 
        Q(date__gte=start_date) & 
        Q(date__lt=end_date)
    ).values()

    