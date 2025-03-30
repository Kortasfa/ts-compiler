/**
 * Производит посимвольное чтение и подсчет количества прочитанных символов
 */
export class Reader {
  private input: string;
  private position: number = 0;
  private recordedText: string = '';

  /**
   * Создает Reader для чтения из строки
   * @param str Входная строка
   */
  constructor(str: string) {
    this.input = str;
  }

  /**
   * Получает текущий символ и перемещает указатель на следующий
   * @throws Ошибку, если достигнут конец строки
   */
  public get(): string {
    if (this.empty()) {
      throw new Error('EOF Error: tried to get char from an empty reader');
    }
    
    const char = this.input[this.position];
    this.position++;
    this.recordedText += char;
    
    return char;
  }

  /**
   * Возвращает текущий символ, не перемещая указатель
   */
  public peek(): string {
    if (this.empty()) {
      return '';
    }
    
    return this.input[this.position];
  }

  /**
   * Отменяет последнее чтение символа
   */
  public unget(): void {
    if (this.position > 0) {
      this.position--;
      this.recordedText = this.recordedText.substring(0, this.recordedText.length - 1);
    }
  }

  /**
   * Возвращает текущую позицию в строке
   */
  public count(): number {
    return this.position;
  }

  /**
   * Проверяет, достигнут ли конец строки
   */
  public empty(): boolean {
    return this.position >= this.input.length;
  }

  /**
   * Устанавливает указатель на указанную позицию
   * @param pos Позиция
   */
  public seek(pos: number): void {
    if (pos >= 0 && pos <= this.input.length) {
      const dropLen = this.position - pos;
      
      if (dropLen <= this.recordedText.length) {
        this.recordedText = this.recordedText.substring(0, this.recordedText.length - dropLen);
      } else {
        this.recordedText = '';
      }
      
      this.position = pos;
    }
  }

  /**
   * Начинает запись символов
   */
  public record(): void {
    this.recordedText = '';
  }

  /**
   * Останавливает запись и возвращает записанную строку
   */
  public stopRecord(): string {
    return this.recordedText;
  }
} 