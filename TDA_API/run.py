
from client.GithubRepo import GithubRepo
from client.TDAClient import TDAClient
import json
import time
import xirr
import dateutil.parser as dp
import datetime

REPO_NAME = "Cheok-Capital/cheok-capital.github.io"
ACCOUNT_ID = 220063151

github_repo = GithubRepo(REPO_NAME)
tda_client = TDAClient()


def current_millis():
    return round(time.time() * 1000)


def dedupe_data(new_entries, old_entries):
    # Deduplicating data of the same timestamp
    deduped_data = []
    seen = set()
    for data in new_entries + old_entries:
        if data["timestamp"] not in seen:
            seen.add(data["timestamp"])
            deduped_data.append(data)

    return deduped_data


def update_spy_data(raw_data):
    spy_json = json.loads(raw_data)
    earliest_timestamp = min(d["timestamp"] for d in spy_json["data"])
    price_history = tda_client.get_daily_price_history(
        symbol='SPY',
        start_millis=earliest_timestamp,
        end_millis=current_millis()
    )
    parsed_price_history = [
        {
            "open": candle["open"],
            "high": candle["high"],
            "low": candle["low"],
            "close": candle["close"],
            "volume": candle["volume"],
            "timestamp": candle["datetime"]
        } for candle in price_history["candles"]
    ]

    # Deduplicating data of the same timestamp
    deduped_data = dedupe_data(
        new_entries=parsed_price_history,
        old_entries=spy_json["data"]
    )

    # Sort from earliest to latest
    spy_json["data"] = sorted(deduped_data, key=lambda d: d["timestamp"])

    return json.dumps(spy_json, separators=(',', ':'), sort_keys=True)


def update_liquidation_value(raw_data):
    liq_json = json.loads(raw_data)

    # Get current liquidation value
    tda_account = tda_client.get_account(ACCOUNT_ID)
    current_liq_value = tda_account["securitiesAccount"]["currentBalances"]["liquidationValue"]

    new_entry = {
        "timestamp": current_millis(),
        "liquidationValue": current_liq_value
    }

    # Deduplicating data of the same timestamp
    deduped_data = dedupe_data(
        new_entries=[new_entry],
        old_entries=liq_json["data"]
    )

    # Sort from earliest to latest
    liq_json["data"] = sorted(deduped_data, key=lambda d: d["timestamp"])

    return json.dumps(liq_json, separators=(',', ':'), sort_keys=True)


def update_cashflow_history(raw_data):
    cashflow_json = json.loads(raw_data)

    tda_cashflows = tda_client.get_transactions(
        ACCOUNT_ID, "CASH_IN_OR_CASH_OUT")
    parsed_cashflows = []

    for cf in tda_cashflows:
        parsed_t = dp.parse(cf["transactionDate"])
        if (cf["type"] == "WIRE_IN"):
            parsed_cashflows.append(
                {'cashflow': -cf["netAmount"], 'timestamp': int(parsed_t.timestamp() * 1000)})
        else:
            parsed_cashflows.append(
                {'cashflow': cf["netAmount"], 'timestamp': int(parsed_t.timestamp() * 1000)})

    deduped_data = dedupe_data(
        new_entries=parsed_cashflows,
        old_entries=cashflow_json["data"]
    )

    cashflow_json["data"] = sorted(deduped_data, key=lambda d: d["timestamp"])

    return json.dumps(cashflow_json, separators=(',', ':'), sort_keys=True)


def update_xirr(raw_data):
    xirr_json = json.loads(raw_data)

    # Load cheok liq & cashflow history
    repo = github_repo.g.get_repo(github_repo.repo)
    file = repo.get_contents("data/cheok.json", ref="stage")
    cheok_file = file.decoded_content.decode("utf-8")
    file = repo.get_contents("data/cashflow.json", ref="stage")
    cashflow_file = file.decoded_content.decode("utf-8")

    # Making sure both are sorted from earliest to latest
    raw_liq = json.loads(cheok_file)["data"]
    raw_liq[0]["liquidationValue"] = -raw_liq[0]["liquidationValue"]
    raw_liq = sorted(raw_liq, key=lambda d: d["timestamp"])

    raw_cashflow = json.loads(cashflow_file)["data"]
    raw_cashflow = sorted(raw_cashflow, key=lambda d: d["timestamp"])

    parsed_liq = []
    parsed_cashflow = []
    generated_xirr = []

    # Parse net liq and cashflow timestamps into readable dates for XIRR formula
    for data in raw_liq:
        parsed_date_liq = str(datetime.datetime.utcfromtimestamp(
            int(data["timestamp"]) / 1e3)).split(" ")[0]
        parsed_liq.append(
            {'date': parsed_date_liq, 'liqValue': data["liquidationValue"], 'raw_timestamp': data["timestamp"]})

    for cf in raw_cashflow:
        parsed_date_cf = str(datetime.datetime.utcfromtimestamp(
            int(cf["timestamp"]) / 1e3)).split(" ")[0]
        parsed_cashflow.append(
            {'date': parsed_date_cf, 'cashflow': cf["cashflow"], 'raw_timestamp': cf["timestamp"]})

    # Get the date of first ever net liq
    initial_year = int(parsed_liq[0]['date'].split("-")[0])
    initial_month = int(parsed_liq[0]['date'].split("-")[1])
    initial_day = int(parsed_liq[0]['date'].split("-")[2])

    # Calculate XIRR between first ever net liq and every other net liq, taking into account all and any cashflow that happened in between
    for parsed_data in parsed_liq:
        values_per_date = {datetime.date(
            initial_year, initial_month, initial_day): parsed_liq[0]['liqValue']}

        for parsed_cf in parsed_cashflow:
            if(parsed_cf["raw_timestamp"] < parsed_data["raw_timestamp"]):
                cf_year = int(parsed_cf['date'].split("-")[0])
                cf_month = int(parsed_cf['date'].split("-")[1])
                cf_day = int(parsed_cf['date'].split("-")[2])
                values_per_date[datetime.date(
                    cf_year, cf_month, cf_day)] = parsed_cf["cashflow"]
            else:
                break

        liq_year = int(parsed_data['date'].split("-")[0])
        liq_month = int(parsed_data['date'].split("-")[1])
        liq_day = int(parsed_data['date'].split("-")[2])
        values_per_date[datetime.date(
            liq_year, liq_month, liq_day)] = parsed_data["liqValue"]

        xirr_val = xirr.xirr(values_per_date)
        # Change "infinity" to 0
        if(any(c.isalpha() for c in str(xirr_val))):
            xirr_val = 0

        generated_xirr.append(
            {"xirr": xirr_val, "timestamp": parsed_data['raw_timestamp']})

    # Deduplicating data of the same timestamp
    deduped_data = dedupe_data(
        new_entries=generated_xirr,
        old_entries=xirr_json["data"]
    )

    xirr_json["data"] = sorted(deduped_data, key=lambda d: d["timestamp"])

    return json.dumps(xirr_json, separators=(',', ':'), sort_keys=True)


def update_twr(raw_data):
    twr_json = json.loads(raw_data)

    # Load cheok liq & cashflow history
    repo = github_repo.g.get_repo(github_repo.repo)
    file = repo.get_contents("data/cheok.json", ref="stage")
    cheok_file = file.decoded_content.decode("utf-8")
    file = repo.get_contents("data/cashflow.json", ref="stage")
    cashflow_file = file.decoded_content.decode("utf-8")

    # Making sure both are sorted from earliest to latest
    raw_liq = json.loads(cheok_file)["data"]
    raw_liq = sorted(raw_liq, key=lambda d: d["timestamp"])

    raw_cashflow = json.loads(cashflow_file)["data"]
    raw_cashflow = sorted(raw_cashflow, key=lambda d: d["timestamp"])

    generated_twr = []
    cumulative_twr = []

    for i in range(1, len(raw_liq)):
        init_mv = raw_liq[i-1]['liquidationValue']
        end_mv = raw_liq[i]['liquidationValue']

        for cf in raw_cashflow:
            if(cf["timestamp"] < raw_liq[i]["timestamp"]):
                init_mv -= cf["cashflow"]
                raw_cashflow.remove(cf)
            else:
                break
        twr = (end_mv/init_mv)

        generated_twr.append(
            {"twr": twr, "timestamp": raw_liq[i]['timestamp']})

    cum_twr_val = 1
    for twr in generated_twr:
        cum_twr_val *= twr['twr']
        cumulative_twr.append(
            {"twr": (cum_twr_val-1)*100, "timestamp": twr['timestamp']})

    # Deduplicating data of the same timestamp
    deduped_data = dedupe_data(
        new_entries=cumulative_twr,
        old_entries=twr_json["data"]
    )

    twr_json["data"] = sorted(deduped_data, key=lambda d: d["timestamp"])

    return json.dumps(twr_json, separators=(',', ':'), sort_keys=True)


def run():

    # Update SPY price history
    github_repo.update_file(
        file_path="data/spy.json",
        commit_message="[Automated] update spy data",
        updater=update_spy_data,
        branch="stage"
    )

    # Update account balance
    github_repo.update_file(
        file_path="data/cheok.json",
        commit_message="[Automated] update liq data",
        updater=update_liquidation_value,
        branch="stage"
    )

    # Update cashflow history
    github_repo.update_file(
        file_path="data/cashflow.json",
        commit_message="[Automated] update cashflow data",
        updater=update_cashflow_history,
        branch="stage"
    )

    # Update xirr
    github_repo.update_file(
        file_path="data/xirr.json",
        commit_message="[Automated] update xirr data",
        updater=update_xirr,
        branch="stage"
    )

    # Update twr
    github_repo.update_file(
        file_path="data/twr.json",
        commit_message="[Automated] update twr data",
        updater=update_twr,
        branch="stage"
    )

    # Create pull request if there isn't one already
    pulls = github_repo.get_pulls(
        state="open",
        base="main",
        head="stage"
    )

    # Just a hack, find an open PR with this title
    # If there ISN'T one, open a PR with this title
    automated_pr_title = "[Automated] update data"

    if pulls.totalCount == 0 or not any(pr.title == automated_pr_title for pr in pulls):
        github_repo.create_pull(
            base="main",
            head="stage",
            title=automated_pr_title
        )


if __name__ == "__main__":
    run()