#!/usr/bin/env python3
"""
Run all uAgents for BlockchainVibe
This script starts all the necessary agents for news processing
"""

import asyncio
import subprocess
import sys
import time
import signal
import os
from pathlib import Path

class AgentManager:
    def __init__(self):
        self.processes = []
        self.agents = [
            {
                'name': 'news_fetcher',
                'script': 'news_fetcher_agent.py',
                'port': 8001
            },
            {
                'name': 'relevance_scorer', 
                'script': 'relevance_scorer_agent.py',
                'port': 8003
            }
        ]
    
    def start_agent(self, agent_config):
        """Start a single agent process"""
        try:
            script_path = Path(__file__).parent / agent_config['script']
            process = subprocess.Popen([
                sys.executable, str(script_path)
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            self.processes.append({
                'name': agent_config['name'],
                'process': process,
                'port': agent_config['port']
            })
            
            print(f"Started {agent_config['name']} agent (PID: {process.pid})")
            return True
            
        except Exception as e:
            print(f"Failed to start {agent_config['name']} agent: {e}")
            return False
    
    def start_all_agents(self):
        """Start all agents"""
        print("Starting BlockchainVibe uAgents...")
        
        for agent_config in self.agents:
            if not self.start_agent(agent_config):
                print(f"Failed to start {agent_config['name']}, continuing with other agents...")
        
        print(f"Started {len(self.processes)} agents")
        return len(self.processes) > 0
    
    def stop_all_agents(self):
        """Stop all running agents"""
        print("Stopping all agents...")
        
        for agent_info in self.processes:
            try:
                agent_info['process'].terminate()
                agent_info['process'].wait(timeout=5)
                print(f"Stopped {agent_info['name']} agent")
            except subprocess.TimeoutExpired:
                agent_info['process'].kill()
                print(f"Force killed {agent_info['name']} agent")
            except Exception as e:
                print(f"Error stopping {agent_info['name']} agent: {e}")
        
        self.processes.clear()
    
    def check_agent_health(self):
        """Check if all agents are still running"""
        healthy_agents = []
        
        for agent_info in self.processes:
            if agent_info['process'].poll() is None:
                healthy_agents.append(agent_info['name'])
            else:
                print(f"Agent {agent_info['name']} has stopped")
        
        return healthy_agents
    
    def run(self):
        """Run the agent manager"""
        def signal_handler(signum, frame):
            print("\nReceived interrupt signal, stopping agents...")
            self.stop_all_agents()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        if not self.start_all_agents():
            print("Failed to start any agents")
            return
        
        try:
            print("All agents are running. Press Ctrl+C to stop.")
            
            while True:
                time.sleep(10)
                healthy_agents = self.check_agent_health()
                
                if not healthy_agents:
                    print("All agents have stopped")
                    break
                
                print(f"Healthy agents: {', '.join(healthy_agents)}")
                
        except KeyboardInterrupt:
            print("\nReceived keyboard interrupt")
        finally:
            self.stop_all_agents()

if __name__ == "__main__":
    # Check if uagents is installed
    try:
        import uagents
        print(f"uAgents version: {uagents.__version__}")
    except ImportError:
        print("uAgents not installed. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "uagents"])
        print("uAgents installed successfully")
    
    manager = AgentManager()
    manager.run()
