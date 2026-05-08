from django.core.management.base import BaseCommand
from django.utils import timezone  # タイムゾーンを考慮した日時操作
from library.models import Loan


class Command(BaseCommand):
    help = '返却期限を過ぎた貸出のステータスを overdue に更新する'

    def handle(self, *args, **options):
        today = timezone.now().date()  # 今日の日付を取得する

        updated_count = Loan.objects.filter(
            status='active',     # 貸出中のレコードのみ対象にする
            due_date__lt=today,  # due_date__lt は「due_date が today より前」を意味する（lt = less than）
        ).update(status='overdue')  # 条件に一致するレコードをまとめて更新する

        self.stdout.write(
            self.style.SUCCESS(f'{updated_count}件の貸出を延滞ステータスに更新しました')
            # self.style.SUCCESS で緑色のテキストとして出力する
        )
