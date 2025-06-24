# Airtable Formulas for City and Country Counting

Based on the analysis, here are the formulas you can use directly in Airtable to count unique cities and countries:

## Current Analysis Results

- **Published Crews**: 362
- **Unique Cities (Published Crews)**: 170
- **Unique Countries (Published Crews)**: 58
- **Manual Count**: 188 cities
- **Difference**: 18 cities

## Airtable Formulas

### 1. Count All Unique Cities (All Records)
```
COUNTA(UNIQUE(Crews.City))
```

### 2. Count All Unique Countries (All Records)
```
COUNTA(UNIQUE(Crews.Country))
```

### 3. Count Unique Cities (Published Only)
```
COUNTA(UNIQUE(FILTER(Crews.City, Crews.Status = "publish")))
```

### 4. Count Unique Countries (Published Only)
```
COUNTA(UNIQUE(FILTER(Crews.Country, Crews.Status = "publish")))
```

### 5. List All Unique Cities (for verification)
```
ARRAYJOIN(UNIQUE(Crews.City), ", ")
```

### 6. List All Unique Countries (for verification)
```
ARRAYJOIN(UNIQUE(Crews.Country), ", ")
```

## Possible Reasons for Discrepancy (18 cities difference)

1. **Status Filtering**: Your manual count might include crews with status other than "publish"
2. **Data Entry Variations**: Case differences, typos, or formatting inconsistencies
3. **Empty Fields**: Some crews might have empty city fields
4. **Recent Changes**: Records added/removed since your manual count
5. **Whitespace/Special Characters**: Leading/trailing spaces or special characters

## Recommendations

1. **Use the "All Records" formulas** if you want to include all crews regardless of status
2. **Check for data quality issues** like empty fields, case variations, or typos
3. **Standardize city names** to ensure consistency
4. **Use the published-only formulas** if you only want to count active/live crews

## Next Steps

To get the exact count matching your manual count of 188:
1. Run the "All Records" formula to see if it gives 188
2. If not, export the City column and compare with your manual list
3. Look for data quality issues like duplicates with different cases or typos