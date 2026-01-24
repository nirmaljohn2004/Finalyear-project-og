import sys
print(f"Python Executable: {sys.executable}")
print(f"System Path: {sys.path}")

try:
    import fpdf
    print(f"FPDF Functioning: {fpdf.__version__ if hasattr(fpdf, '__version__') else 'Yes'}")
    print(f"FPDF File: {fpdf.__file__}")
except ImportError as e:
    print(f"FPDF Import Failed: {e}")

try:
    import reportlab
    print(f"ReportLab Functioning: {reportlab.__version__}")
except ImportError as e:
    print(f"ReportLab Import Failed: {e}")
