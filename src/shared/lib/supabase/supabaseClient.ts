/**
 * @file supabaseClient.ts
 * @description 프로젝트 전역에서 사용하는 Supabase 클라이언트 인스턴스.
 * 환경변수에서 Project URL 과 익명 키(anon key)를 읽어 `createClient` 로 생성한다.
 * 이 파일에서 export 된 `supabase` 인스턴스를 import 하여 DB 조회/삽입 등에 활용한다.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Supabase 전역 클라이언트 인스턴스 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
