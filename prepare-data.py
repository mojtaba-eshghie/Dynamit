#!/usr/bin/python3

import csv
import pandas as pd
import numpy as np
import json
import subprocess

'''
with open('data/final.csv', 'r') as final_csv:
    csv_reader = csv.reader(final_csv, delimiter=',')
    line_count = 0
    for row in csv_reader:
        print(row)
'''
data = pd.read_csv('data/final.csv')
sc_balances_before_file = open('data/sc-balances-before-exec.json')
sc_balances_after_file = open('data/sc-balances-after-exec.json')

before_exec_sc_data = json.load(sc_balances_before_file)
after_exec_sc_data = json.load(sc_balances_after_file)


gas_used = []
input_sizes = []
victim_balance_deltas = []
attacker_balance_deltas = []
labels = []
tx_hashs = []
call_stack_depths = []

'''
for sc_address, before_balance in before_exec_sc_data.items():
    
'''

for i in range(0, data.shape[0]):

    labels.append(data.iloc[i]['fuzz_string'].split(',')[-2])
    
    
    tx_hashs.append(data.iloc[i]['tx_hash'])
    
    gas_used.append(int(data.iloc[i]['gas_used']))



    '''
    from => is the attacker
    to => is the victim
    '''
    attacker_addr = data.iloc[i]['from']
    victim_addr = data.iloc[i]['to']

    victim_balance_deltas.append(int(after_exec_sc_data[victim_addr]) - int(before_exec_sc_data[victim_addr]))
    attacker_balance_deltas.append(int(after_exec_sc_data[attacker_addr]) - int(before_exec_sc_data[attacker_addr]))

    




    # call_stack_depths
    index = str(i + 1)
    print(index)
    result = subprocess.run(["./compare.py", index], stdout=subprocess.PIPE)
    call_stack_depths.append(float(result.stdout))


    print('Data point added for tx #{}'.format(index))


output_df = pd.DataFrame({
    'tx_hash': tx_hashs,
    'gas_used': gas_used,
    'victim_balance_delta': victim_balance_deltas,
    'attacker_balance_delta': attacker_balance_deltas,
    'call_stack_depth': call_stack_depths, 
    'label': labels
})

output_df.to_csv('data/final_prepared.csv', index=True)
print('Successfully store the final_prepared.csv file')