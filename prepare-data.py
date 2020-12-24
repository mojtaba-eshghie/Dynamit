#!/usr/bin/python3

import csv
import pandas as pd
import numpy as np

'''
with open('data/final.csv', 'r') as final_csv:
    csv_reader = csv.reader(final_csv, delimiter=',')
    line_count = 0
    for row in csv_reader:
        print(row)
'''
data = pd.read_csv('data/final.csv')
#print(data.iloc[0])

gas_diffs = []
input_sizes = []
victim_balance_deltas = []
attacker_balance_deltas = []
labels = []
tx_hashs = []

for i in range(0, data.shape[1] - 1):
    
    #labels.append(data.iloc[i]['fuzz_string'].split(',')[-1])
    print(data.iloc[i]['fuzz_string'])

    tx_hashs.append(data.iloc[i]['tx_hash'])

    gas_diffs.append(int(data.iloc[i]['gas']) - int(data.iloc[i]['gas_used']))

    input_sizes.append(len(data.iloc[i]['input']))


    if not pd.isna(data.iloc[i]['victim_balance_after_tx']) and not pd.isna(data.iloc[i]['victim_balance_before_tx']) and data.iloc[i]['victim_balance_after_tx'] != '' and data.iloc[i]['victim_balance_before_tx'] != '':
        victim_balance_deltas.append(int(data.iloc[i]['victim_balance_after_tx']) - int(data.iloc[i]['victim_balance_before_tx']))
    else:
        victim_balance_deltas.append(np.nan)
    
    if not pd.isna(data.iloc[i]['attacker_balance_after_tx']) and not pd.isna(data.iloc[i]['attacker_balance_before_tx']) and data.iloc[i]['attacker_balance_after_tx'] != '' and data.iloc[i]['attacker_balance_after_tx'] != '':
        attacker_balance_deltas.append(int(data.iloc[i]['attacker_balance_after_tx']) - int(data.iloc[i]['attacker_balance_before_tx']))
    else:
        attacker_balance_deltas.append(np.nan)


output_df = pd.DataFrame({
    'tx_hash': tx_hashs,
    'gas_diff': gas_diffs,
    'input_size': input_sizes,
    'victim_balance_delta': victim_balance_deltas,
    'attacker_balance_delta': attacker_balance_deltas,
    'label': labels
})

output_df.to_csv('data/final_prepared.csv', index=True)