/**
 * Производит посимвольное чтение и подсчет количества прочитанных символов
 * 
 * Reader - это класс, отвечающий за чтение входной строки символ за символом.
 * Он предоставляет удобный интерфейс для лексического анализатора,
 * позволяя читать символы, возвращаться назад и записывать прочитанные символы.
 * 
 * Основные возможности:
 * - Чтение символов и перемещение указателя
 * - Просмотр текущего символа без его чтения (peek)
 * - Возврат на один символ назад (unget)
 * - Запись прочитанных символов
 * - Установка позиции на произвольное место во входной строке
 * 
 * Reader служит низкоуровневым компонентом для лексического анализатора,
 * обеспечивая эффективный доступ к символам исходного кода.
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
  public getNextChar(): string {
    if (this.isAtEnd()) {
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
  public peekChar(): string {
    if (this.isAtEnd()) {
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
  public getCurrentPosition(): number {
    return this.position;
  }

  /**
   * Проверяет, достигнут ли конец строки
   */
  public isAtEnd(): boolean {
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