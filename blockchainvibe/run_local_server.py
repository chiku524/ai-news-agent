#!/usr/bin/env python3
"""
Script to run the local development server
"""

import os
import sys
import subprocess

def main():
    # Set environment variables for OAuth secrets
    # You'll need to replace these with your actual secrets
    os.environ["GOOGLE_CLIENT_SECRET"] = "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"
    os.environ["GITHUB_CLIENT_SECRET"] = "7567121f79e7ba2520d5d8cce22a4f90e90ff3c8"
    os.environ["TWITTER_CLIENT_SECRET"] = "Qw8ImtckPxdNs9YljLMigQwtmJqtjrPE5pLb0VfqKDxlCQDQme"
    os.environ["DISCORD_CLIENT_SECRET"] = "d3QI-oClsHiCTFPumMkQ8OWwAaJ5O8us"
    
    print("Starting BlockchainVibe Local Development Server...")
    print("Make sure to update OAuth secrets in this script!")
    print("Server will run on http://localhost:8000")
    print("Frontend should run on http://localhost:3000")
    print("\n" + "="*50)
    
    # Change to server directory and run the local server
    os.chdir("server")
    subprocess.run([sys.executable, "local_server.py"])

if __name__ == "__main__":
    main()
