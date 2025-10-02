# productos/templatetags/currency_filters.py
from django import template

register = template.Library()

@register.filter
def currency_clp(value):
    """Formatea un número como moneda en pesos chilenos (ej: $28.999)"""
    try:
        value = int(value)
        return f"${value:,.0f}".replace(",", ".")
    except (ValueError, TypeError):
        return value
