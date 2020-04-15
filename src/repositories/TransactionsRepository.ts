import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalance(operator: string): number {
    return this.transactions
      .filter(t => t.type === operator)
      .reduce((acc, tr) => acc + tr.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance('income');
    const outcome = this.calculateBalance('outcome');
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, type, value }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });

    const { total } = this.getBalance();
    if (type === 'outcome' && total < value) {
      throw Error('You cannot remove more than you have in the box.');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
